import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import { EPInText_Decoration } from "#/src/client/component/primitive/in-text/element/decoration"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as z from "zod"

export type ELCN__ProdCardFieldPrice_Props = {
    readonly node_id: string
    readonly node_price_uah: number
    readonly node_price_usd: number
}

export const ELCN_ProdCardFieldPrice: r.FC<ELCN__ProdCardFieldPrice_Props> = props => {
    const dispatch = gs.useDispatch()

    return <div className={st.field_price}>
        <EPEdViewText_View
            text={props.node_price_usd.toString()}
            validation_schema={z.coerce.number().gte(0)}

            st_notext
            st_size={`small`}
            cl_text={st.field_price__text}
            cl_input_row={st.field_price__row}

            ev_change={tvalue => {
                const tvalue_num = Number.parseFloat(tvalue)

                if (Number.isFinite(tvalue_num)) {
                    dispatch(rem.product.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            price_usd: tvalue_num,
                        },
                    }))
                }
            }}

            render_after={cprops => {
                return <EPInText_Decoration ev_press={cprops?.act_focus} st_size={`small`}>
                    $
                </EPInText_Decoration>
            }}
        />

        <EPEdViewText_View
            text={props.node_price_uah.toString()}
            validation_schema={z.coerce.number().gte(0)}

            st_notext
            st_size={`small`}
            cl_text={st.field_price__text}
            cl_input_row={st.field_price__row}

            ev_change={tvalue => {
                const tvalue_num = Number.parseFloat(tvalue)

                if (Number.isFinite(tvalue_num)) {
                    dispatch(rem.product.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            price_uah: tvalue_num,
                        },
                    }))
                }
            }}

            render_after={cprops => {
                return <EPInText_Decoration ev_press={cprops?.act_focus} st_size={`small`}>
                    ₴
                </EPInText_Decoration>
            }}
        />
    </div>
}
