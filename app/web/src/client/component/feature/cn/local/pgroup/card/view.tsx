import { ELCN_PGroupCardFieldImg } from "#/src/client/component/feature/cn/local/pgroup/card/field_img"
import { ELCN_PGroupCardFieldTitle } from "#/src/client/component/feature/cn/local/pgroup/card/field_title"
import { EPIcon_Svg, EPIcon_Svg_Kind } from "#/src/client/component/primitive/icon/element/svg"
import EPPending_Screen from "#/src/client/component/primitive/pending/element/screen"
import st from "#client/component/feature/cn/style/pgroup/card/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as gs from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"

export type ELCN__PGroupCardView_Props = {
    readonly ref?: r.Ref<HTMLElement | null>
    readonly remnode: gs.RemNode<"pgroup">
    readonly deletion_set: (id: std.Maybe<string>) => void
}

export const ELCN_PGroupCardView: r.FC<ELCN__PGroupCardView_Props> = r.memo(props => {
    const rview = gs.useRemView("pgroup", props.remnode)

    const status_pending = (
        rview.pending.del
        || rview.pending.post
    )

    return <article ref={props.ref} className={cl(st.root, status_pending && st._pending)}>
        <rfc.CmpIf value={status_pending}>
            {() => <EPPending_Screen />}
        </rfc.CmpIf>

        <ELCN_PGroupCardFieldImg
            node_id={rview.data.id}
            node_img_id={rview.data.img_id}
            node_url_raw={rview.data.url_raw}
        />

        <ELCN_PGroupCardFieldTitle
            node_id={rview.data.id}
            node_title={rview.data.title}
        />

        <div className={st.field_act}>
            <div className={st.field_act__list}>
                <button
                    className={cl(st.field_act__act, st._delete)}
                    aria-label={`delete pgroup ${rview.data.title}`}

                    onClick={() => {
                        props.deletion_set(std.maybe_new_some(rview.data.id))
                    }}
                >
                    <EPIcon_Svg kind={EPIcon_Svg_Kind.Trash} />
                </button>
            </div>
        </div>
    </article>
})

export default ELCN_PGroupCardView
