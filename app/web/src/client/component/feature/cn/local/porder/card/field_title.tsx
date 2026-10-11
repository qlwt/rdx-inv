import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/porder/card/field_title.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as stdr from "@ta/std-react"
import * as std from "@ta/std"
import * as ri18 from "react-i18next"

const validator_title = (str: string) => {
    return str.length <= cst.porder_limits.title_mxlength
}

const validator_description = (str: string) => {
    return str.length <= cst.porder_limits.description_mxlength
}

export type ELCN__POrderCardFieldTitle_Props = {
    readonly node_id: string
    readonly node_title: string
    readonly node_description: string
}

export const ELCN_POrderCardFieldTitle: r.FC<ELCN__POrderCardFieldTitle_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = gs.useDispatch()

    const throttle = stdr.useConstLazy(() => ({
        title: std.throttler_new_delay(500),
        description: std.throttler_new_delay(500),
    }))

    return <div className={st.root}>
        <EPEdViewText_View
            text={props.node_title}
            placeholder={t(`cn.grid.card.ph_title`)}
            validation={validator_title}

            st_notext
            st_size={`small`}
            cl_text={st.head}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_title(tvalue)) { return }

                throttle.title.emit(() => {
                    dispatch(rem.porder.act.patch({
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
            text={props.node_description}
            placeholder={t(`cn.grid.card.ph_desc`)}
            validation={validator_description}

            st_notext
            st_size={`small`}
            cl_text={st.desc}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_description(tvalue)) { return }

                throttle.description.emit(() => {
                    dispatch(rem.porder.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            description: tvalue,
                        },
                    }))
                })
            }}

            ev_blur={() => {
                throttle.description.flush()
            }}
        />
    </div>
}

export default ELCN_POrderCardFieldTitle
