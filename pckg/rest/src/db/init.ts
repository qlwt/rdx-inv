import { env_db_host, env_db_name, env_db_password, env_db_port, env_db_user } from "#src/env"
import * as ksly from "kysely"
import * as pg from "pg"
import * as cst from "@ta/cst"
import dbdef from "./db.sql"

export type Database = {
    porder: {
        id: string
        deleted_at: number | null
        created_at: number

        title: string
        description: string
    },

    product: {
        id: string
        deleted_at: number | null
        created_at: number

        porder_id: string | null

        kind: cst.ProductStatus_Kind
        status_wear: cst.ProductStatus_Wear
        status_avail: cst.ProductStatus_Avail

        title: string
        price_usd: number
        price_uah: number
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

pg.types.setTypeParser(pg.types.builtins.INT8, Number.parseInt)

export const db_define = async function() {
    return await db.transaction().execute(async trx => {
        await ksly.sql.raw(dbdef).execute(trx)
    })
}
