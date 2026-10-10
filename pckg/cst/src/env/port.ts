export const api_port = Number.parseInt(process.env.API_PORT ?? "NaN")
export const web_port = Number.parseInt(process.env.WEB_PORT ?? "NaN")

if (!Number.isFinite(api_port)) {
    throw new Error(`Env API_PORT is not setup`)
}

if (!Number.isFinite(web_port)) {
    throw new Error(`Env WEB_PORT is not setup`)
}
