export const api_url = process.env.API_URL!
export const web_url = process.env.WEB_URL!

if (typeof api_url !== "string") {
    throw new Error(`Env API_URL is not setup`)
}

if (typeof web_url !== "string") {
    throw new Error(`Env WEB_URL is not setup`)
}
