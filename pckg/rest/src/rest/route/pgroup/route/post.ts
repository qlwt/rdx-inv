import { db } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as cst from "@ta/cst";
import * as eu from "@ta/express-utils";
import * as z from "zod";
import { v7 as uuid_new } from "uuid"

export type RestRoutePGroupPost_New_Params = {}

export const restroute_pgroup_post_new = (params: RestRoutePGroupPost_New_Params) => {
    const schema_body = z.strictObject({
        img_id: z.uuidv7().nullable(),
        title: z.string().max(cst.pgroup_limits.title_mxlength),
    })

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: `/rest/pgroup`,

            middleware: [
                eu.middleware_new_json_short(),
            ],

            handler: async ctx => {
                const id = uuid_new()
                const created_at = Date.now()
                const body = eu.input_parse_zod(schema_body, ctx.req.body)

                const result = await db.transaction().execute(async trx => {
                    await (trx
                        .insertInto("pgroup")
                        .values({
                            id,
                            created_at,
                            deleted_at: null,
                            
                            ...body,
                        })
                        .executeTakeFirst()
                    )

                    return {
                        id,
                        created_at,
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
