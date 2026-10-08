import { db, type DatabaseSlice } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import { sql_new_cond_and } from "#src/util/sql/new/cond_and";
import * as cst from "@ta/cst";
import * as eu from "@ta/express-utils";
import * as std from "@ta/std";
import * as ksly from "kysely";
import * as z from "zod";

export type RestRouteProductMGet_New_Params = {}

export const restroute_product_mget_new = (params: RestRouteProductMGet_New_Params) => {
    const schema_query = z.strictObject({
        limit: std.zod_json().pipe(z.number().int().gte(0).nullable()).exactOptional(),
        cursor: std.zod_json().pipe(z.uuidv7().nullable()).exactOptional(),

        pick: std.zod_json().pipe(z.strictObject({
            porder_id: z.uuidv7().nullable().exactOptional(),
            pgroup_id: z.uuidv7().nullable().exactOptional(),
            status_wear: z.enum(cst.ProductStatus_Wear).exactOptional(),
            status_avail: z.enum(cst.ProductStatus_Avail).exactOptional(),
        })).exactOptional(),
    })

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path({
            method: "get",
            path: `/rest/product`,

            middleware: [
                eu.middleware_new_url_short(),
            ],

            handler: async ctx => {
                schema_query.parse(ctx.req.query)
                const query = eu.input_parse_zod(schema_query, ctx.req.query)

                const result = await db.transaction().execute(async trx => {
                    const sql_cond_gen = sql_new_cond_and([
                        ksly.sql`product.deleted_at is NULL`,

                        ...Object.entries(query.pick ?? []).map(([pick_key, pick_value]) => {
                            if (pick_value === null) {
                                return ksly.sql`product.${ksly.sql.raw(pick_key)} is NULL`
                            } else {
                                return ksly.sql`product.${ksly.sql.raw(pick_key)} = ${pick_value}`
                            }
                        }),
                    ])

                    const sql_cond_search = sql_new_cond_and([
                        sql_cond_gen,

                        typeof query.cursor === "string" ? ksly.sql`product.id <= ${query.cursor}` : null,
                    ])

                    const sql_limit = typeof query.limit === "number" ? ksly.sql`limit ${query.limit}` : ksly.sql``
                    const sql_cursor_offset = typeof query.limit === "number" ? ksly.sql`offset ${query.limit}` : ksly.sql``

                    const query_nodes = ksly.sql`
                        with s_product as (
                            select distinct
                                product.*
                            from product
                            where (
                                ${sql_cond_search}
                            )
                            order by id desc
                            ${sql_limit}
                        ),
                        s_pgroup as (
                            select distinct
                                pgroup.*
                            from pgroup, s_product
                            where (
                                pgroup.id = s_product.pgroup_id
                                and pgroup.deleted_at is NULL
                            )
                        ),
                        j_product as (
                            select
                                json_agg(s_product.*) as data
                            from s_product
                        ),
                        j_pgroup as (
                            select
                                json_agg(s_pgroup.*) as data
                            from s_pgroup
                        )
                        select
                            json_build_object(
                                'product', j_product.data,
                                'pgroup', j_pgroup.data
                            ) as data
                        from j_product, j_pgroup
                    `

                    const query_count = ksly.sql<{ count: bigint, }>`
                        select
                            count(product.*) as count
                        from product
                        where ${sql_cond_gen}
                    `

                    const query_cursor = ksly.sql<{ id: string | null }>`
                        select
                            product.id
                        from product
                        where (${sql_cond_search})
                        order by id desc
                        limit 1
                        ${sql_cursor_offset}
                    `

                    if (typeof query.limit === "number") {
                        const [res_count, res_nodes, res_cursor] = await Promise.all([
                            query_count.execute(trx),
                            query_nodes.execute(trx),
                            query_cursor.execute(trx),
                        ] as const)

                        if (res_count.rows.length !== 1 || res_nodes.rows.length !== 1) {
                            throw eu.error_new_custom(500, cst.ServerError.Internal)
                        }

                        return {
                            slice: (res_nodes.rows[0]! as any).data as DatabaseSlice,
                            cursor: res_cursor.rows[0]?.id ?? null,
                            count: Number(res_count.rows[0]!.count),
                        }
                    } else {
                        const [res_count, res_nodes] = await Promise.all([
                            query_count.execute(trx),
                            query_nodes.execute(trx),
                        ])

                        if (res_count.rows.length !== 1 || res_nodes.rows.length !== 1) {
                            throw eu.error_new_custom(500, cst.ServerError.Internal)
                        }

                        return {
                            cursor: null,
                            slice: (res_nodes.rows[0]! as any) as DatabaseSlice,
                            count: Number(res_count.rows[0]!.count),
                        }
                    }
                })

                return eu.response_new_json({
                    body: result,
                    status: 200,
                })
            },
        }),
    } satisfies Cluster_Route
}
