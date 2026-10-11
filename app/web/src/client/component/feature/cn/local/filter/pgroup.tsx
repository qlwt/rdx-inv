import ELCN_DDNListPGroup from "#/src/client/component/feature/cn/local/ddn/list_pgroup"
import { imgurl_attr_new_wrapper } from "#/src/client/util/imgurl/attr_new_wrapper"
import st_ddn from "#client/component/feature/cn/style/ddn/grid.module.scss"
import st from "#client/component/feature/cn/style/filter/pgroup.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELCN__FilterPGroup_Props = {
    readonly selection: std.Maybe<string>
    readonly selection_set: std.FnSetterStateles<std.Maybe<string>>
}

export const ELCN_FilterPGroup: r.FC<ELCN__FilterPGroup_Props> = props => {
    const { t } = ri18.useTranslation()
    const [open, open_set] = r.useState(false)

    const rview_pgroup = gs.useRemViewFallback(null, "pgroup", gs.useSelect(state => {
        if (props.selection.kind) {
            return rem.pgroup.sel.selectById(state, props.selection.value) ?? null
        }

        return null
    }))

    gs.usePagLoad("pgroup", {
        status_active: open,
        limit: null,
        pick: {},
    })

    return <rddn.CmpContainerVirtual open={open} open_set={open_set}>
        <rddn.CmpButton className={cl(st.btn, st_ddn.btn)}>
            <div className={st.imgc}>
                <img
                    draggable={false}
                    className={st.img}

                    {...imgurl_attr_new_wrapper("pgroup", rview_pgroup?.data ?? null)}
                />
            </div>

            <div className={st.title}>
                <span className={st.title__text}>
                    {rview_pgroup ? rview_pgroup.data.title : t(`cn.grid.filter.no_group`)}
                </span>
            </div>
        </rddn.CmpButton>

        <ELCN_DDNListPGroup
            open={open}
            open_set={open_set}

            selection={std.maybe_unpack(props.selection, null)}

            ev_pick={pgroup_id => {
                if (typeof pgroup_id === "string") {
                    props.selection_set(std.maybe_new_some(pgroup_id))
                } else {
                    props.selection_set(std.MNONE)
                }
            }}
        />
    </rddn.CmpContainerVirtual>
}

export default ELCN_FilterPGroup
