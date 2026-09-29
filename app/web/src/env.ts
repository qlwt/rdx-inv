import * as dotenv from "dotenv"

dotenv.config()

export const env_port_public = Number.parseInt(process.env.PORT_PUBLIC || "NaN")

if (Number.isNaN(env_port_public)) {
    throw new Error("env.PORT_PUBLIC is NaN")
}
