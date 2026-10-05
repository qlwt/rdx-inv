import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/porder/card/view.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as z from "zod"

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
            validation_schema={z.string().max(cst.porder_limits.title_mxlength)}

            st_notext
            st_size={`small`}
            cl_text={st.field_title__head}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
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
            validation_schema={z.string().max(cst.porder_limits.description_mxlength)}

            st_notext
            st_size={`small`}
            cl_text={st.field_title__desc}
            cl_text_placeholder={st._placeholder}

            ev_change={tvalue => {
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
