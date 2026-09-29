import { env_client_host, env_port } from "#src/env"
import * as rest from "@ta/rest"
import express from "express"

type Server_New_Params = {
    readonly origin_list: readonly string[]
}

const server_new = async function(params: Server_New_Params) {
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

    for (const cluster of Object.values(rest.rapi)) {
        app.use(rest.cluster_compose(cluster))
    }

    return app
}

const server_init = async function() {
    const app = await server_new({
        origin_list: [
            env_client_host,
        ]
    })

    app.listen(env_port, () => {
        console.log(`Api server initialized on port ${env_port}`)
    })
}

const main = async function() {
    await rest.db_define()
    await server_init()
}

main()
