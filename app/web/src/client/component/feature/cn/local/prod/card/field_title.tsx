import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/prod/card/field_title.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as stdr from "@ta/std-react"
import * as std from "@ta/std"
import * as ri18 from "react-i18next"

const validator_title = (str: string) => {
    return str.length <= cst.product_limits.title_mxlength
}

const validator_spec = (str: string) => {
    return str.length <= cst.product_limits.spec_mxlength
}

export type ELCN__ProdCardFieldTitle_Props = {
    readonly node_id: string
    readonly node_title: string
    readonly node_spec: string
}

export const ELCN_ProdCardFieldTitle: r.FC<ELCN__ProdCardFieldTitle_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = gs.useDispatch()

    const throttle = stdr.useConstLazy(() => ({
        title: std.throttler_new_delay(500),
        spec: std.throttler_new_delay(500),
    }))

    return <div className={st.root}>
        <EPEdViewText_View
            text={props.node_title}
            validation={validator_title}
            placeholder={t(`cn.grid.card.ph_title`)}

            st_notext
            st_size={`small`}
            cl_text={st.head}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_title(tvalue)) { return }

                throttle.title.emit(() => {
                    dispatch(rem.product.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            title: tvalue,
                        },
                    }))
                })
            }}

            ev_blur={() => {
                throttle.title.flush()
            }}
        />

        <EPEdViewText_View
            text={props.node_spec}
            validation={validator_spec}
            placeholder={t(`cn.grid.card.ph_spec`)}

            st_notext
            st_size={`small`}
            cl_text={st.spec}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_spec(tvalue)) { return }

                throttle.spec.emit(() => {
                    dispatch(rem.product.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            spec: tvalue,
                        },
                    }))
                })
            }}

            ev_blur={() => {
                throttle.spec.flush()
            }}
        />
    </div>
}
