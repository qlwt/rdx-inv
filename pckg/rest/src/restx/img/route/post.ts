import { db } from "#src/db/init"
import { img_post } from "#src/util/img/post"
import * as cst from "@ta/cst"
import * as eu from "@ta/express-utils"
import { v7 as uuid_new } from "uuid"
import * as z from "zod"
import * as std from "@ta/std"


export type RestX_ImgRoutePost_New_Params = {
}

export const restx_img_route_post_new = function(_params: RestX_ImgRoutePost_New_Params) {
    const schema_body = z.object({
        payload: std.zod_json().pipe(z.strictObject({
        }))
    })

    const schema_files = z.strictObject({
        img: z.tuple([z.any()] as const)
    })

    return {
        schema: {
            body: schema_body,
            files: schema_files,
        },

        handler: eu.route_new_path({
            method: "post",
            path: `/restx/img`,

            middleware: [
                eu.middleware_new_cookie(),

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
                const file = files.img[0] as eu.MulterFile

                await db.transaction().execute(async trx => {
                    await img_post({
                        trx,
                        file,
                        img_id,
                        created_at,
                    })
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
