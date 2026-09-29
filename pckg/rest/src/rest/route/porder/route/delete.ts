import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as z from "zod"
import * as eu from "@ta/express-utils"
import { db } from "#src/db/init";
import * as cst from "@ta/cst"

export type RestRoutePOrderDelete_New_Params = {}

export const restroute_porder_delete_new = (params: RestRoutePOrderDelete_New_Params) => {
    const schema_url = z.object({
        id: z.coerce.number().int(),
    });

    return {
        schema: {
            url: schema_url,
        },

        handler: eu.route_new_path({
            method: "delete",
            path: `/rest/porder/:id`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ctx => {
                const deleted_at = new Date()
                const url = eu.input_parse_zod(schema_url, ctx.req.params)

                await db.transaction().execute(async trx => {
                    const sql_result = await (trx
                        .updateTable("porder")
                        .where("id", "=", url.id)
                        .set({ deleted_at, })
                        .limit(1)
                        .executeTakeFirst()
                    )

                    if (sql_result.numUpdatedRows === 0n) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }
                })

                return eu.response_new_json({
                    body: { deleted_at, },
                    status: 200,
                })
            },
        }),
    } satisfies Cluster_Route
}
