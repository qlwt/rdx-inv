import { env_db_host, env_db_name, env_db_password, env_db_port, env_db_user } from "#src/env"
import * as cst from "@ta/cst"
import * as ksly from "kysely"
import * as pg from "pg"
import dbdef from "./db.sql"

export type Database = {
    img: {
        id: string
        deleted_at: number | null
        created_at: number
    }

    img_variant: {
        id: string
        deleted_at: number | null
        created_at: number

        area: number
        img_id: string
        filename: string
        mimetype: string
    }

    pgroup: {
        id: string
        deleted_at: number | null
        created_at: number

        title: string
        img_id: string | null
    }

    porder: {
        id: string
        deleted_at: number | null
        created_at: number

        title: string
        description: string
        sent_to: string | null
        sent_at: number | null
    }

    product: {
        id: string
        deleted_at: number | null
        created_at: number

        porder_id: string | null

        pgroup_id: string | null
        status_wear: cst.ProductStatus_Wear
        status_avail: cst.ProductStatus_Avail

        spec: string
        title: string
        price_usd: number
        price_uah: number
    }
}

export type DatabaseOut = (
    & {
        readonly [K in keyof Database]: Database[K]
    }
    & {
        readonly porder: {
            readonly product_count: number
            readonly product_price_uah: number
            readonly product_price_usd: number
        }

        readonly pgroup: {
            readonly url_raw: string | null
        }
    }
)

export type DatabaseSlice = {
    [K in keyof DatabaseOut]?: DatabaseOut[K][] | null
}

export const db = new ksly.Kysely<Database>({
    dialect: new ksly.PostgresDialect({
        pool: new pg.Pool({
            password: env_db_password,
            database: env_db_name,
            host: env_db_host,
            user: env_db_user,
            port: env_db_port,
        }),
    }),
})

pg.types.setTypeParser(pg.types.builtins.INT8, Number.parseInt)

export const db_define = async function() {
    return await db.transaction().execute(async trx => {
        await ksly.sql.raw(dbdef).execute(trx)
    })
}
