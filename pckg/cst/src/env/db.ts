export const db_name = process.env.POSTGRES_DB!
export const db_user = process.env.POSTGRES_USER!
export const db_password = process.env.POSTGRES_PASSWORD!

export const db_port = Number.parseInt(process.env.DB_PORT ?? "NaN")
export const db_host = process.env.DB_HOST!

if (typeof db_name !== "string") {
    throw new Error(`Env POSTGRES_DB is not setup`)
}

if (typeof db_user !== "string") {
    throw new Error(`Env POSTGRES_USER is not setup`)
}

if (typeof db_password !== "string") {
    throw new Error(`Env POSTGRES_PASSWORD is not setup`)
}

if (!Number.isFinite(db_port)) {
    throw new Error(`Env DB_PORT is not setup`)
}

if (typeof db_host !== "string") {
    throw new Error(`Env DB_HOST is not setup`)
}
