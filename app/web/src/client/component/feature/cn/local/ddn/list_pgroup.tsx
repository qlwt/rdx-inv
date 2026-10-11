import EPPending_Screen from "#/src/client/component/primitive/pending/element/screen"
import { imgurl_attr_new_wrapper } from "#/src/client/util/imgurl/attr_new_wrapper"
import st_ddn from "#client/component/feature/cn/style/ddn/grid.module.scss"
import st from "#client/component/feature/cn/style/filter/pgroup.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as ri18 from "react-i18next"

type EL__GroupCard_Props = {
    readonly selection: string | null
    readonly pgroup: gs.RemNode<"pgroup">

    readonly ev_pick: std.FnSetterStateles<string>
    readonly open_set: std.FnSetterStateles<boolean>
}

const EL_GroupCard: r.FC<EL__GroupCard_Props> = props => {
    const rview = gs.useRemView("pgroup", props.pgroup)

    if (!rview) { return null }

    const status_disabled = rview.data.id === props.selection

    return <button
        disabled={status_disabled}
        className={st_ddn.item}

        onClick={() => {
            props.ev_pick(props.pgroup.id)

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

export type ELCN__DDNListPGroup_Props = {
    readonly selection: string | null

    readonly open: boolean
    readonly open_set: std.FnSetterStateles<boolean>

    readonly ev_pick: std.FnSetterStateles<string | null>
}

export const ELCN_DDNListPGroup: r.FC<ELCN__DDNListPGroup_Props> = props => {
    const { t } = ri18.useTranslation()
    const pagnode = gs.usePagNode("pgroup", {})
    const rnode_list = gs.useSelect(rem.pgroup.sel.selectAll)

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
        status_active: props.open,
        limit: null,
        pick: {},
    })

    return <rddn.CmpListPortal
        portal={`dropdown-root`}

        gap={3}
        align={"center"}
        rearrange={{ deps: [rnode_list_fit.length], }}

        className={st_ddn.listc}
    >
        <rddn.CmpContent className={st_ddn.list}>
            <rfc.CmpIf value={!pagnode || pagnode.status_pending || pagnode.cursor.kind === false}>
                {() => <EPPending_Screen />}
            </rfc.CmpIf>

            <rfc.CmpIf value={rnode_list.length === 0 && pagnode && std.maybe_is(pagnode.cursor, null)}>
                <div className={st_ddn.placeholder}>
                    {t(`cn.grid.ph_pgroup`)}
                </div>
            </rfc.CmpIf>

            <rfc.CmpIf value={rnode_list.length >= 0 && pagnode && std.maybe_is(pagnode.cursor, null)}>
                <button
                    className={st.card_empty}
                    disabled={props.selection === null}

                    onClick={() => {
                        props.ev_pick(null)
                        props.open_set(false)
                    }}
                >
                    {t(`cn.grid.filter.no_group`)}
                </button>
            </rfc.CmpIf>

            <div className={st_ddn.grid}>
                <rfc.CmpLoop data={rnode_list_fit}>
                    {rnode => <EL_GroupCard
                        key={`group:${rnode.id}`}

                        pgroup={rnode}
                        selection={props.selection}

                        ev_pick={props.ev_pick}
                        open_set={props.open_set}
                    />}
                </rfc.CmpLoop>
            </div>
        </rddn.CmpContent>
    </rddn.CmpListPortal>
}

export default ELCN_DDNListPGroup
