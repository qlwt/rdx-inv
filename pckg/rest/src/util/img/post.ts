import { type Database } from "#src/db/init"
import * as cst from "@ta/cst"
import * as eu from "@ta/express-utils"
import * as ksly from "kysely"
import fs from "node:fs/promises"
import path from "node:path"
import * as sharp from "sharp"
import { v7 as uuid_new } from "uuid"

export type Img_Post_Params = {
    readonly img_id: string
    readonly created_at: number
    readonly file: eu.MulterFile
    readonly trx: ksly.Transaction<Database>
}

export const img_post = async function(params: Img_Post_Params) {
    const { trx, file, img_id, created_at, } = params

    const image_sharp = sharp.default(file.path)
    const image_meta = await image_sharp.metadata()
    const image_area = Math.floor(Math.sqrt(image_meta.height * image_meta.width))

    const l_templates = new Array<number>()

    for (const template_area of cst.img_limits.area_list) {
        if (template_area < image_area) {
            l_templates.push(template_area)
        } else {
            l_templates.push(image_area)

            break
        }
    }

    const variant_imgs = await Promise.all(l_templates.map(async template_area => {
        const name = `${uuid_new()}_${template_area}`
        const divider = Math.sqrt(image_area / template_area)

        const meta = await sharp.default(file.path).resize({
            fit: "contain",
            width: Math.max(1, Math.floor(image_meta.width / divider)),
            height: Math.max(1, Math.floor(image_meta.height / divider)),

            withoutEnlargement: true,
        }).webp({
            quality: 80,
        }).toFile(path.resolve(`./storage/${name}`))

        return {
            meta,

            filename: name,
            area: template_area,
            mimetype: `image/webp`,
        }
    }))

    await (trx
        .insertInto(`img`)
        .values({
            id: img_id,
            created_at,
            deleted_at: null,
        })
        .execute()
    )

    await (trx
        .insertInto(`img_variant`)
        .values(variant_imgs.map(variant => {
            return {
                created_at,
                deleted_at: null,
                id: uuid_new(),

                img_id,
                area: variant.area,
                filename: variant.filename,
                mimetype: variant.mimetype,
            }
        }))
        .execute()
    )

    await fs.rm(file.path)
}
