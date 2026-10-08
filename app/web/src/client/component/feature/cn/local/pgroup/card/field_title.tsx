import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/pgroup/card/view.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"

const validator_title = (str: string) => {
    return str.length <= cst.pgroup_limits.title_mxlength
}

export type ELCN__PGroupCardFieldTitle_Props = {
    readonly node_id: string
    readonly node_title: string
}

export const ELCN_PGroupCardFieldTitle: r.FC<ELCN__PGroupCardFieldTitle_Props> = props => {
    const dispatch = gs.useDispatch()

    return <div className={st.field_title}>
        <EPEdViewText_View
            text={props.node_title}
            placeholder={`No Title`}
            validation={validator_title}

            st_notext
            st_size={`small`}
            cl_text={st.field_title__text}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (!validator_title(tvalue)) { return }

                dispatch(rem.pgroup.act.patch({
                    url: {
                        id: props.node_id,
                    },

                    body: {
                        title: tvalue,
                    },
                }))
            }}
        />
    </div>
}
