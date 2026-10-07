import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/porder/card/view.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"

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
    const dispatch = gs.useDispatch()

    return <div className={st.field_title}>
        <EPEdViewText_View
            text={props.node_title}
            placeholder={`No Title`}
            validation={validator_title}

            st_notext
            st_size={`small`}
            cl_text={st.field_title__head}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (validator_title(tvalue)) { return }

                dispatch(rem.porder.act.patch({
                    url: {
                        id: props.node_id,
                    },

                    body: {
                        title: tvalue,
                    },
                }))
            }}
        />

        <EPEdViewText_View
            text={props.node_description}
            placeholder={`No Description`}
            validation={validator_description}

            st_notext
            st_size={`small`}
            cl_text={st.field_title__desc}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
                if (validator_description(tvalue)) { return }

                dispatch(rem.porder.act.patch({
                    url: {
                        id: props.node_id,
                    },

                    body: {
                        description: tvalue,
                    },
                }))
            }}
        />
    </div>
}

export default ELCN_POrderCardFieldTitle
