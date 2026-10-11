import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/pgroup/card/field_title.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import * as ri18 from "react-i18next"

const validator_title = (str: string) => {
    return str.length <= cst.pgroup_limits.title_mxlength
}

export type ELCN__PGroupCardFieldTitle_Props = {
    readonly node_id: string
    readonly node_title: string
}

export const ELCN_PGroupCardFieldTitle: r.FC<ELCN__PGroupCardFieldTitle_Props> = props => {
    const dispatch = gs.useDispatch()
    const { t } = ri18.useTranslation()
    const throttle = stdr.useConstLazy(() => std.throttler_new_delay(500))

    return <div className={st.root}>
        <EPEdViewText_View
            text={props.node_title}
            validation={validator_title}
            placeholder={t(`cn.grid.card.ph_title`)}

            st_notext
            st_size={`small`}
            cl_text={st.text}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_title(tvalue)) { return }

                throttle.emit(() => {
                    dispatch(rem.pgroup.act.patch({
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
                throttle.flush()
            }}
        />
    </div>
}
