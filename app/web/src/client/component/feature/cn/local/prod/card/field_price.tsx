import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import { EPInText_Decoration } from "#/src/client/component/primitive/in-text/element/decoration"
import st from "#client/component/feature/cn/style/prod/card/field_price.module.scss"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import * as r from "react"

const validator_price = function(str: string) {
    const num = Number.parseFloat(str)

    return Number.isFinite(num) && num >= 0
}

export type ELCN__ProdCardFieldPrice_Props = {
    readonly node_id: string
    readonly node_price_uah: number
    readonly node_price_usd: number
}

export const ELCN_ProdCardFieldPrice: r.FC<ELCN__ProdCardFieldPrice_Props> = props => {
    const dispatch = gs.useDispatch()

    const throttle = stdr.useConstLazy(() => ({
        usd: std.throttler_new_delay(500),
        uah: std.throttler_new_delay(500),
    }))

    return <div className={st.root}>
        <EPEdViewText_View
            validation={validator_price}
            text={props.node_price_usd.toString()}

            st_notext
            st_size={`small`}
            cl_text={st.text}
            cl_input_row={st.row}

            ev_change={tvalue => {
                const tvalue_num = Number.parseFloat(tvalue)

                if (Number.isFinite(tvalue_num) && tvalue_num >= 0) {
                    throttle.usd.emit(() => {
                        dispatch(rem.product.act.patch({
                            url: {
                                id: props.node_id,
                            },

                            body: {
                                price_usd: tvalue_num,
                            },
                        }))
                    })
                }
            }}

            ev_blur={() => {
                throttle.usd.flush()
            }}

            render_after={cprops => {
                return <EPInText_Decoration ev_press={cprops?.act_focus} st_size={`small`}>
                    $
                </EPInText_Decoration>
            }}
        />

        <EPEdViewText_View
            validation={validator_price}
            text={props.node_price_uah.toString()}

            st_notext
            st_size={`small`}
            cl_text={st.text}
            cl_input_row={st.row}

            ev_change={tvalue => {
                const tvalue_num = Number.parseFloat(tvalue)

                if (Number.isFinite(tvalue_num) && tvalue_num >= 0) {
                    throttle.uah.emit(() => {
                        dispatch(rem.product.act.patch({
                            url: {
                                id: props.node_id,
                            },

                            body: {
                                price_uah: tvalue_num,
                            },
                        }))
                    })
                }
            }}

            ev_blur={() => {
                throttle.uah.flush()
            }}

            render_after={cprops => {
                return <EPInText_Decoration ev_press={cprops?.act_focus} st_size={`small`}>
                    ₴
                </EPInText_Decoration>
            }}
        />
    </div>
}
