import { env_db_host, env_db_name, env_db_password, env_db_port, env_db_user } from "#src/env"
import * as ksly from "kysely"
import * as pg from "pg"
import * as cst from "@ta/cst"
import dbdef from "./db.sql"

export type Database = {
    porder: {
        id: number
        deleted_at: Date | null
        created_at: Date

        title: string
        description: string
    },

    product: {
        id: number
        deleted_at: Date
        created_at: Date

        porder_id: number

        kind: cst.ProductStatus_Kind
        status_wear: cst.ProductStatus_Wear
        status_avail: cst.ProductStatus_Avail

        title: string
        price_usd: number
        warranty_start: Date
        warranty_end: Date
    },
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

export const db_define = async function() {
    return await db.transaction().execute(async trx => {
        await ksly.sql.raw(dbdef).execute(trx)
    })
}
