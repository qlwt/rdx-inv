import rolldown_babel from "@rolldown/plugin-babel"
import * as vite_react from "@vitejs/plugin-react"
import * as path from "node:path"
import * as node_url from "node:url"
import { defineConfig } from "vite"

export default defineConfig({
    root: path.resolve("./src"),

    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",

                importers: [{
                    findFileUrl(url) {
                        if (!url.startsWith("util:")) { return null }

                        return node_url.pathToFileURL(path.resolve(`./src/client/style/${url.substring(5)}`))
                    }
                }]
            }
        }
    },

    plugins: [
        vite_react.default(),
        rolldown_babel({ presets: [vite_react.reactCompilerPreset({})], })
    ],

    resolve: {
        tsconfigPaths: true,
    },

    build: {
        outDir: path.resolve("./build/client/"),

        rollupOptions: {
            input: {
                index_console: path.resolve("./src/index.html")
            },
        },
    },
})
