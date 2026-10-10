import "#src/env"
import * as env_api from "@ta/cst/env_api"
import * as rest from "@ta/rest"
import express from "express"
import fs from "node:fs/promises"
import path from "node:path"

const storage_init = async function() {
    try {
        await fs.mkdir(path.resolve("./storage"))
    } catch (error) {
    }
}

type Server_New_Params = {
    readonly origin_list: readonly string[]
}

const app_new = async function(params: Server_New_Params) {
    const app = express()

    app.use((req, res, next) => {
        if (req.headers.origin && params.origin_list.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
        }

        res.setHeader("Access-Control-Allow-Methods", "POST, PATCH, DELETE, GET, PUT, HEAD, OPTIONS")
        res.setHeader("Access-Control-Allow-Credentials", "true")
        res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Access-Control-Allow-Origin")

        next()
    })

    for (const cluster of Object.values(rest.rxapi)) {
        app.use(rest.cluster_compose(cluster))
    }

    for (const cluster of Object.values(rest.rapi)) {
        app.use(rest.cluster_compose(cluster))
    }

    return app
}

const server_init = async function(app: express.Express) {
    const server = app.listen(env_api.api_port, () => {
        console.log(`Api server initialized on port ${env_api.api_port}`)
    })

    rest.wss_new_gen(server)
}

const main = async function() {
    await storage_init()

    const app = await app_new({
        origin_list: [
            env_api.web_url,
        ]
    })

    await rest.db_define()
    await server_init(app)
}

main()
