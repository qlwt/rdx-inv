import st from "#client/component/feature/cn/style/head.module.scss"
import * as fas from "@fortawesome/free-solid-svg-icons/faPlus"
import * as rfa from "@fortawesome/react-fontawesome"
import * as r from "react"
import * as capi from "@ta/capi"
import * as gs from "@ta/gstate"
import * as std from "@ta/std"

export type ELCN__Head_Props<Target extends gs.RemKey> = {
    readonly title: string
    readonly target: Target
    readonly pick: NonNullable<capi.SendMGet_Query<Target>["pick"]>

    readonly ev_post: VoidFunction
}

export const ELCN_Head = function <Target extends gs.RemKey>(props: ELCN__Head_Props<Target>): r.ReactNode {
    const pagnode = gs.usePagNode(props.target, props.pick)

    const count_total = r.useMemo(() => {
        if (!pagnode) { return null }

        return std.maybe_unpack(pagnode.count_total, null)
    }, [pagnode])

    return <div className={st.root}>
        <div className={st.actlist}>
            <button className={st.act} onClick={props.ev_post}>
                <rfa.FontAwesomeIcon icon={fas.faPlus} />
            </button>
        </div>

        <h1 className={st.title}>
            {props.title}{typeof count_total === "number" ? ` / ${count_total}` : ``}
        </h1>
    </div>
}

export default ELCN_Head
