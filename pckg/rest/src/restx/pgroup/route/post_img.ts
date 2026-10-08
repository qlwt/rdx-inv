import { db } from "#src/db/init"
import { img_post } from "#src/util/img/post"
import * as cst from "@ta/cst"
import * as eu from "@ta/express-utils"
import * as std from "@ta/std"
import { v7 as uuid_new } from "uuid"
import * as z from "zod"

export type RestX_PGroupRoutePost_New_Params = {
}

export const restx_pgroup_route_post_img_new = function(_params: RestX_PGroupRoutePost_New_Params) {
    const schema_body = z.object({
        payload: std.zod_json().pipe(z.strictObject({
        }))
    })

    const schema_url = z.strictObject({
        id: z.uuidv7(),
    })

    const schema_files = z.strictObject({
        img: z.tuple([z.any()] as const)
    })

    return {
        schema: {
            url: schema_url,
            body: schema_body,
            files: schema_files,
        },

        handler: eu.route_new_path({
            method: "post",
            path: `/restx/pgroup/:id/img`,

            middleware: [
                eu.middleware_new_multer({
                    limits: {
                        files: 1,
                        fields: 255,

                        // 255 bytes, 255 ANCI characters
                        fieldNameSize: 255,

                        // expected relatively small payload, 5kb per field
                        fieldSize: 5 << 10,
                        fileSize: cst.img_limits.size_mx,
                    },

                    files: [{
                        name: "img",
                        maxCount: 1,
                    }],

                    filter: ({ file, next }) => {
                        if (!file.mimetype.startsWith("image")) {
                            throw eu.error_new_custom(400, cst.ServerError.BadReq)
                        }

                        next()
                    },
                }),
            ],

            handler: async ({ req, }) => {
                const img_id = uuid_new()
                const created_at = Date.now()

                const files = eu.input_parse_zod(schema_files, req.files)
                const url = eu.input_parse_zod(schema_url, req.params)
                const file = files.img[0] as eu.MulterFile

                await db.transaction().execute(async trx => {
                    await img_post({
                        trx,
                        file,
                        img_id,
                        created_at,
                    })

                    const sql_result = await (trx
                        .updateTable("pgroup")
                        .where("id", "=", url.id)
                        .where("deleted_at", "is", null)
                        .set({ img_id: img_id, })
                        .executeTakeFirst()
                    )

                    if (sql_result.numUpdatedRows === 0n) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }
                })

                return eu.response_new_json({
                    body: {
                        id: img_id,
                        created_at,
                    },
                })
            },
        })
    }
}
