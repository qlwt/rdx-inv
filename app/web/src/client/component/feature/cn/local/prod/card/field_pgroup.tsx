import { imgurl_attr_new_wrapper } from "#/src/client/util/imgurl/attr_new_wrapper"
import st_ddn from "#client/component/feature/cn/style/prod/card/option_grid.module.scss"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"

type EL__DDNItem_Props = {
    readonly pgroup: gs.RemNode<"pgroup">

    readonly prod_id: string
    readonly prod_pgroup_id: string | null

    readonly open_set: std.FnSetterStateles<boolean>
}

const EL_GroupCard: r.FC<EL__DDNItem_Props> = props => {
    const dispatch = gs.useDispatch()
    const rview = gs.useRemView("pgroup", props.pgroup)

    if (!rview) { return null }

    const status_disabled = rview.data.id === props.prod_pgroup_id

    return <button
        disabled={status_disabled}
        className={st_ddn.item}

        onClick={() => {
            dispatch(rem.product.act.patch({
                url: {
                    id: props.prod_id,
                },

                body: {
                    pgroup_id: rview.data.id,
                },
            }))

            props.open_set(false)
        }}
    >
        <img
            draggable={false}
            className={st_ddn.item__img}

            {...imgurl_attr_new_wrapper("pgroup", rview.data)}
        />
    </button>
}

export type ELCN__ProdCardFieldPGroup_Props = {
    readonly node_id: string
    readonly node_pgroup_id: string | null
}

export const ELCN_ProdCardFieldPGroup: r.FC<ELCN__ProdCardFieldPGroup_Props> = props => {
    const [open, open_set] = r.useState(false)

    const pagnode = gs.usePagNode("pgroup", {})
    const rnode_list = gs.useSelect(rem.pgroup.sel.selectAll)

    const rview_pgroup = gs.useRemViewFallback(null, "pgroup", gs.useSelect(state => {
        if (typeof props.node_pgroup_id === "string") {
            return rem.pgroup.sel.selectById(state, props.node_pgroup_id) ?? null
        }

        return null
    }))

    const rnode_list_fit = r.useMemo(() => {
        const result: gs.RemNode<"pgroup">[] = []
        const cursor = pagnode ? pagnode.cursor : std.MNONE

        for (const remnode of rnode_list) {
            if (!cursor.kind || cursor.value !== null && remnode.id <= cursor.value) {
                break
            }

            result.push(remnode)
        }

        return result
    }, [rnode_list, pagnode])

    gs.usePagLoad("pgroup", {
        status_active: open,
        limit: null,
        pick: {},
    })

    return <rddn.CmpContainerVirtual open={open} open_set={open_set}>
        <rddn.CmpButton className={cl(st.field_pgroup, st_ddn.btn)}>
            <img
                draggable={false}
                className={st.field_pgroup__img}

                {...imgurl_attr_new_wrapper("pgroup", rview_pgroup?.data ?? null)}
            />
        </rddn.CmpButton>

        <rddn.CmpListPortal
            portal={`dropdown-root`}

            gap={3}
            align={"center"}
            rearrange={{ deps: [rnode_list_fit.length], }}

            className={st_ddn.listc}
        >
            <rddn.CmpContent className={st_ddn.list}>
                <rfc.CmpIf value={!pagnode || pagnode.status_pending || pagnode.cursor.kind === false}>
                    <div className={st.field_pgroup__pending}>
                        <rbs.Spinner variant="light" />
                    </div>
                </rfc.CmpIf>

                <rfc.CmpIf value={rnode_list.length === 0 && pagnode && std.maybe_is(pagnode.cursor, null)}>
                    <div className={st.placeholder}>
                        No Groups Available
                    </div>
                </rfc.CmpIf>

                <rfc.CmpLoop data={rnode_list_fit}>
                    {rnode => <EL_GroupCard
                        key={`group:${rnode.id}`}

                        open_set={open_set}

                        pgroup={rnode}

                        prod_id={props.node_id}
                        prod_pgroup_id={props.node_pgroup_id}
                    />}
                </rfc.CmpLoop>
            </rddn.CmpContent>
        </rddn.CmpListPortal>
    </rddn.CmpContainerVirtual>
}

export default ELCN_ProdCardFieldPGroup
