import { db } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as cst from "@ta/cst";
import * as eu from "@ta/express-utils";
import * as z from "zod";
import { v7 as uuid_new } from "uuid"

export type RestRouteProductPost_New_Params = {}

export const restroute_product_post_new = (params: RestRouteProductPost_New_Params) => {
    const schema_body = z.strictObject({
        spec: z.string().max(cst.product_limits.spec_mxlength),
        title: z.string().max(cst.product_limits.title_mxlength),
        price_uah: z.number().gte(0),
        price_usd: z.number().gte(0),

        status_wear: z.enum(cst.ProductStatus_Wear),
        status_avail: z.enum(cst.ProductStatus_Avail),

        pgroup_id: z.uuidv7().nullable(),
        porder_id: z.uuidv7().nullable(),
    })

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: `/rest/product`,

            middleware: [
                eu.middleware_new_json_short(),
            ],

            handler: async ctx => {
                const id = uuid_new()
                const created_at = Date.now()
                const body = eu.input_parse_zod(schema_body, ctx.req.body)

                const result = await db.transaction().execute(async trx => {
                    await (trx
                        .insertInto("product")
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
