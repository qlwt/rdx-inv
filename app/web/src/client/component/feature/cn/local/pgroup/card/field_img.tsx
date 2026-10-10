import { imgurl_attr_new_wrapper } from "#/src/client/util/imgurl/attr_new_wrapper"
import st from "#client/component/feature/cn/style/pgroup/card/field_img.module.scss"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"

export type ELCN__PGroupCardFieldImg_Props = {
    readonly node_id: string
    readonly node_img_id: string | null
    readonly node_url_raw: string | null
}

export const ELCN_PGroupCardFieldImg: r.FC<ELCN__PGroupCardFieldImg_Props> = props => {
    const dispatch = gs.useDispatch()

    const ref_input = r.useRef<HTMLInputElement | null>(null)

    return <button
        className={st.root}

        onClick={() => {
            ref_input.current?.click()
        }}
    >
        <img
            draggable={false}
            className={st.img}

            {...imgurl_attr_new_wrapper(
                "pgroup",
                {
                    img_id: props.node_img_id,
                    url_raw: props.node_url_raw,
                }
            )}
        />

        <input
            type={`file`}
            ref={ref_input}
            className={st.input}

            onInput={ev => {
                const file = ev.currentTarget.files?.[0]

                if (file) {
                    dispatch(rem.pgroup.act.post_img({
                        body: {},

                        url: {
                            id: props.node_id,
                        },

                        files_raw: {
                            img: [{ kind: "file", data: { file }, }],
                        },

                        files_process: async files_raw => {
                            return {
                                img: await Promise.all(
                                    files_raw.img.map(async filedef => await capi.filedef_new_compressed(
                                        filedef,
                                        {
                                            useWebWorker: true,
                                            maxSizeMB: cst.img_limits.size_mx >> 20,
                                        }
                                    ))
                                ) as [capi.FileDataDef]
                            }
                        },
                    }))
                }
            }}
        />
    </button>
}
