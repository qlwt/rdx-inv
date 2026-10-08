import type { ImgUrl_Attr } from "#/src/client/util/imgurl/type/attr";
import type { ImgUrl_TName } from "#/src/client/util/imgurl/type/tname";
import * as cst from "@inv/cst";
import type * as rest from "@inv/rest";
import type { rxapi } from "@ta/rest";

type Query = rest.Cluster_Schema<(typeof rxapi)["img"], "get", "query">

const query_new = function(id: string, area: number): Query {
    return {
        id,
        area,
    }
}

type Src_New_Params = {
    readonly query: Query
}

const src_new = function(params: Src_New_Params): string {
    const url = new URL(`${cst.urlbase_api}/restx/img`)

    for (const key of Object.keys(params.query) as (keyof typeof params.query)[]) {
        url.searchParams.append(key, JSON.stringify(params.query[key]))
    }

    return url.toString()
}

// expected to be of .length >= 1
const sizes = [128, 256, 512, 1024, 2048, 4096]

export type ImgUrl_New_Src = {
    readonly img_id: string | null
    readonly url_raw: string | null
}

export type ImgUrl_New_Return = {
    readonly tname: ImgUrl_TName

    readonly payload: {
        readonly attr: ImgUrl_Attr
    } | null
}

export const imgurl_new_wrapper = function(tname: ImgUrl_TName, src: ImgUrl_New_Src | null): ImgUrl_New_Return {
    if (src === null) {
        return {
            tname,
            payload: null,
        }
    }

    const { url_raw, img_id } = src

    if (typeof url_raw === "string") {
        return {
            tname,

            payload: {
                attr: {
                    src: url_raw,
                },
            },
        }
    }

    if (typeof img_id === "string") {
        const srcs = sizes.map(area => {
            return {
                size: area,

                url: src_new({
                    query: query_new(img_id, area)
                }),
            }
        })

        return {
            tname,

            payload: {
                attr: {
                    src: srcs.at(-1)!.url,
                    srcSet: srcs.map(src => `${src.url} ${src.size}w`).join(", "),
                },
            }
        }
    }

    return {
        tname,
        payload: null
    }
}
