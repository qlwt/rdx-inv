import { db } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as cst from "@ta/cst";
import * as eu from "@ta/express-utils";
import * as std from "@ta/std";
import * as z from "zod";

export type RestRouteProductMGet_New_Params = {}

export const restroute_product_mget_new = (params: RestRouteProductMGet_New_Params) => {
    const schema_query = z.strictObject({
        limit: std.zod_json().pipe(z.number().int().gte(0).nullable()).exactOptional(),
        cursor: std.zod_json().pipe(z.uuidv7().nullable()).exactOptional(),

        pick: std.zod_json().pipe(z.strictObject({
            porder_id: z.uuidv7().nullable().exactOptional(),
            kind: z.enum(cst.ProductStatus_Kind).exactOptional(),
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
                    let builder_nodes = (trx
                        .selectFrom("product")
                        .orderBy("id", "desc")
                        .where("deleted_at", "is", null)
                        .selectAll()
                    )

                    let builder_count = (trx
                        .selectFrom("product")
                        .select(eb => [eb.fn.count("id").as("count")])
                        .where("deleted_at", "is", null)
                    )

                    let builder_cursor = (trx
                        .selectFrom("product")
                        .select(["id"])
                        .orderBy("id", "desc")
                        .where("deleted_at", "is", null)
                        .limit(1)
                    )

                    if (typeof query.limit === "number") {
                        builder_nodes = builder_nodes.limit(query.limit)
                    }

                    if (typeof query.cursor === "string") {
                        builder_nodes = builder_nodes.where("id", "<=", query.cursor)
                        builder_cursor = builder_cursor.where("id", "<=", query.cursor)
                    }

                    if (query.pick) {
                        for (const [pick_key, pick_value] of Object.entries(query.pick)) {
                            if (pick_value === null) {
                                builder_count = builder_count.where(pick_key as any, "is", null)
                                builder_nodes = builder_nodes.where(pick_key as any, "is", null)
                                builder_cursor = builder_cursor.where(pick_key as any, "is", null)
                            } else {
                                builder_count = builder_count.where(pick_key as any, "=", pick_value)
                                builder_nodes = builder_nodes.where(pick_key as any, "=", pick_value)
                                builder_cursor = builder_cursor.where(pick_key as any, "=", pick_value)
                            }
                        }
                    }

                    if (typeof query.limit === "number") {
                        const [res_count, res_nodes, res_cursor] = await Promise.all([
                            builder_count.executeTakeFirstOrThrow(),
                            builder_nodes.execute(),
                            builder_cursor.offset(query.limit).executeTakeFirst(),
                        ] as const)

                        return {
                            count: Number(res_count.count),
                            cursor: res_cursor?.id ?? null,
                            node_list: res_nodes,
                        }
                    } else {
                        const [res_count, res_nodes] = await Promise.all([
                            builder_count.executeTakeFirstOrThrow(),
                            builder_nodes.execute(),
                        ])

                        return {
                            cursor: null,
                            node_list: res_nodes,
                            count: Number(res_count.count),
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
