import ELCN_POrderCardFieldSent from "#/src/client/component/feature/cn/local/porder/card/field_sent"
import ELCN_POrderCardFieldTitle from "#/src/client/component/feature/cn/local/porder/card/field_title"
import st from "#client/component/feature/cn/style/porder/card/view.module.scss"
import * as fas_play from "@fortawesome/free-solid-svg-icons/faPlay"
import * as fas_trash from "@fortawesome/free-solid-svg-icons/faTrashCan"
import * as faw from "@fortawesome/react-fontawesome"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as gs from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"

export type ELCN__POrderCardView_Props = {
    readonly ref?: r.Ref<HTMLElement>
    readonly remnode: gs.RemNode<"porder">

    readonly status_compact: boolean
    readonly status_selected: boolean
    readonly deletion_set: (id: std.Maybe<string>) => void
    readonly selection_set: (id: std.Maybe<string>) => void
}

export const ELCN_POrderCardView: r.FC<ELCN__POrderCardView_Props> = props => {
    const rview = gs.useRemView("porder", props.remnode)

    const status_pending = (
        rview.pending.del
        || rview.pending.post
    )

    return <article ref={props.ref} className={cl(st.root, props.status_compact && st._compact)}>
        <rfc.CmpIf value={status_pending}>
            {() => <div className={st.pending}>
                <rbs.Spinner variant={"white"} />
            </div>}
        </rfc.CmpIf>

        <ELCN_POrderCardFieldTitle
            node_id={rview.data.id}
            node_title={rview.data.title}
            node_description={rview.data.description}
        />

        <ELCN_POrderCardFieldSent
            node_id={rview.data.id}
            node_sent_at={rview.data.sent_at}
            node_sent_to={rview.data.sent_to}

            status_compact={props.status_compact}
        />

        <div className={st.field_act}>
            <button
                aria-label={`view products under that order`}

                className={cl(
                    st.field_act__act,
                    props.status_selected && st._active
                )}

                onClick={() => {
                    r.startTransition(() => {
                        if (props.status_selected) {
                            props.selection_set(std.MNONE)
                        } else {
                            r.startTransition(() => {
                                props.selection_set(std.maybe_new_some(rview.data.id))
                            })
                        }
                    })
                }}
            >
                <faw.FontAwesomeIcon icon={fas_play.faPlay} />
            </button>

            <button
                className={cl(st.field_act__act, st._delete)}
                aria-label={`delete product ${rview.data.title}`}

                onClick={() => {
                    props.deletion_set(std.maybe_new_some(rview.data.id))
                }}
            >
                <faw.FontAwesomeIcon icon={fas_trash.faTrashCan} />
            </button>
        </div>
    </article>
}

export default ELCN_POrderCardView
