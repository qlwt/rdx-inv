import ELCN_DDNListPGroup from "#/src/client/component/feature/cn/local/ddn/list_pgroup"
import { imgurl_attr_new_wrapper } from "#/src/client/util/imgurl/attr_new_wrapper"
import st from "#client/component/feature/cn/style/prod/card/field_pgroup.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"

export type ELCN__ProdCardFieldPGroup_Props = {
    readonly node_id: string
    readonly node_pgroup_id: string | null
}

export const ELCN_ProdCardFieldPGroup: r.FC<ELCN__ProdCardFieldPGroup_Props> = props => {
    const dispatch = gs.useDispatch()
    const [open, open_set] = r.useState(false)

    const rview_pgroup = gs.useRemViewFallback(null, "pgroup", gs.useSelect(state => {
        if (typeof props.node_pgroup_id === "string") {
            return rem.pgroup.sel.selectById(state, props.node_pgroup_id) ?? null
        }

        return null
    }))

    gs.usePagLoad("pgroup", {
        status_active: open,
        limit: null,
        pick: {},
    })

    return <rddn.CmpContainerVirtual open={open} open_set={open_set}>
        <rddn.CmpButton className={st.root}>
            <img
                draggable={false}
                className={st.img}

                {...imgurl_attr_new_wrapper("pgroup", rview_pgroup?.data ?? null)}
            />
        </rddn.CmpButton>

        <ELCN_DDNListPGroup
            selection={props.node_pgroup_id}

            open={open}
            open_set={open_set}

            ev_pick={pgroup_id => {
                dispatch(rem.product.act.patch({
                    url: {
                        id: props.node_id,
                    },

                    body: {
                        pgroup_id: pgroup_id,
                    },
                }))
            }}
        />
    </rddn.CmpContainerVirtual>
}

export default ELCN_ProdCardFieldPGroup
