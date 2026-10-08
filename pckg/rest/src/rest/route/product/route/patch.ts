import { db } from "#src/db/init";
import type { Cluster_Route } from "#src/util/cluster/type/cluster";
import * as cst from "@ta/cst";
import * as eu from "@ta/express-utils";
import * as z from "zod";

export type RestRouteProductPatch_New_Params = {}

export const restroute_product_patch_new = (params: RestRouteProductPatch_New_Params) => {
    const schema_url = z.strictObject({
        id: z.uuidv7(),
    })

    const schema_body = z.strictObject({
        price_uah: z.number().gte(0).exactOptional(),
        price_usd: z.number().gte(0).exactOptional(),
        spec: z.string().max(cst.product_limits.spec_mxlength).exactOptional(),
        title: z.string().max(cst.product_limits.title_mxlength).exactOptional(),

        status_wear: z.enum(cst.ProductStatus_Wear).exactOptional(),
        status_avail: z.enum(cst.ProductStatus_Avail).exactOptional(),

        pgroup_id: z.uuidv7().nullable().exactOptional(),
        porder_id: z.uuidv7().nullable().exactOptional(),
    })

    return {
        schema: {
            url: schema_url,
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "patch",
            path: `/rest/product/:id`,

            middleware: [
                eu.middleware_new_url_short(),
                eu.middleware_new_json_short(),
            ],

            handler: async ctx => {
                const url = eu.input_parse_zod(schema_url, ctx.req.params)
                const body = eu.input_parse_zod(schema_body, ctx.req.body)

                if (Object.keys(body).length === 0) {
                    throw eu.error_new_custom(400, cst.ServerError.BadReq)
                }

                await db.transaction().execute(async trx => {
                    const sql_result = await (trx
                        .updateTable("product")
                        .where("id", "=", url.id)
                        .where("deleted_at", "is", null)
                        .set(body)
                        .executeTakeFirst()
                    )

                    if (sql_result.numUpdatedRows === 0n) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }
                })

                return eu.response_new_json({
                    body: {},
                    status: 200,
                })
            },
        }),
    } satisfies Cluster_Route
}
