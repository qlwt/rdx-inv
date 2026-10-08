import { db, type Database } from "#src/db/init"
import type { Cluster_Route } from "#src/util/cluster/type/cluster"
import * as cst from "@ta/cst"
import * as eu from "@ta/express-utils"
import * as std from "@ta/std"
import * as ksly from "kysely"
import fs from "node:fs/promises"
import path from "node:path"
import * as z from "zod"

export type RestX_ImgRouteGet_New_Params = {
}

export const restx_img_route_get_new = function(_params: RestX_ImgRouteGet_New_Params) {
    const schema_query = z.object({
        id: std.zod_json().pipe(z.uuid()),
        area: std.zod_json().pipe(z.int()),
    })

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path<RestX_ImgRouteGet_New_Params>({
            method: "get",
            path: `/restx/img`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
            ],

            handler: async ctx => {
                const { req, } = ctx
                const query = eu.input_parse_zod(schema_query, req.query)

                const result = await db.transaction().execute(async trx => {
                    const variant_list = (await ksly.sql`
                        select
                            img_variant.*
                        from img
                        left join img_variant on img_variant.img_id = img.id
                        where (
                            img.id = ${query.id}
                            and img.deleted_at is NULL
                            and img_variant.deleted_at is NULL
                        )
                        order by img_variant.area asc
                    `.execute(trx)).rows as Database["img_variant"][]

                    if (variant_list.length <= 0) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }

                    for (const variant of variant_list) {
                        if (variant.area >= query.area) {
                            return variant
                        }
                    }

                    return variant_list.at(-1)!
                })

                const file = await fs.readFile(path.resolve(`./storage/${result.filename}`))

                return eu.response_new_custom({
                    body: file,
                    status: 200,

                    headers: {
                        "Content-Type": result.mimetype,
                    },
                })
            },
        })
    } satisfies Cluster_Route
}

