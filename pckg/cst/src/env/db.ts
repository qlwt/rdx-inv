export const db_name = process.env.POSTGRES_DB!
export const db_user = process.env.POSTGRES_USER!
export const db_password = process.env.POSTGRES_PASSWORD!

export const db_url = process.env.DB_URL!

if (typeof db_name !== "string") {
    throw new Error(`Env POSTGRES_DB is not setup`)
}

if (typeof db_user !== "string") {
    throw new Error(`Env POSTGRES_USER is not setup`)
}

if (typeof db_password !== "string") {
    throw new Error(`Env POSTGRES_PASSWORD is not setup`)
}

if (typeof db_url !== "string") {
    throw new Error(`Env DB_URL is not setup`)
}
