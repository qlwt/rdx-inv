import { db, type DatabaseSlice } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as eu from "@ta/express-utils";
import * as std from "@ta/std";
import * as z from "zod";
import * as ksly from "kysely"

export type RestRoutePGroupMGet_New_Params = {}

export const restroute_pgroup_mget_new = (params: RestRoutePGroupMGet_New_Params) => {
    const schema_query = z.strictObject({
        limit: std.zod_json().pipe(z.number().int().gte(0).nullable()).exactOptional(),
        cursor: std.zod_json().pipe(z.uuidv7().nullable()).exactOptional(),

        pick: std.zod_json().pipe(z.strictObject({
        }))
    })

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path({
            method: "get",
            path: `/rest/pgroup`,

            middleware: [
                eu.middleware_new_url_short(),
            ],

            handler: async ctx => {
                const query = eu.input_parse_zod(schema_query, ctx.req.query)

                const result = await db.transaction().execute(async trx => {
                    let builder_cursor = (trx
                        .selectFrom("pgroup")
                        .select(["id"])
                        .orderBy("id", "desc")
                        .where("deleted_at", "is", null)
                        .limit(1)
                    )

                    let builder_count = (trx
                        .selectFrom("pgroup")
                        .select(eb => [eb.fn.count("id").as("count")])
                        .where("deleted_at", "is", null)
                    )

                    let builder_nodes = (trx
                        .selectFrom("pgroup")
                        .orderBy("id", "desc")
                        .where("deleted_at", "is", null)
                        .selectAll("pgroup")
                        .select([
                            ksly.sql<null | string>`NULL`.as("url_raw")
                        ])
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

                            slice: {
                                pgroup: res_nodes,
                            } satisfies DatabaseSlice as DatabaseSlice,
                        }
                    } else {
                        const [res_count, res_nodes] = await Promise.all([
                            builder_count.executeTakeFirstOrThrow(),
                            builder_nodes.execute(),
                        ])

                        return {
                            cursor: null,
                            count: Number(res_count.count),

                            slice: {
                                pgroup: res_nodes,
                            } satisfies DatabaseSlice as DatabaseSlice,
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
