import { ELCN_ProdCardFieldAvail } from "#/src/client/component/feature/cn/local/prod/card/field_avail"
import ELCN_ProdCardFieldKind from "#/src/client/component/feature/cn/local/prod/card/field_kind"
import { ELCN_ProdCardFieldPrice } from "#/src/client/component/feature/cn/local/prod/card/field_price"
import { ELCN_ProdCardFieldTitle } from "#/src/client/component/feature/cn/local/prod/card/field_title"
import { ELCN_ProdCardFieldWear } from "#/src/client/component/feature/cn/local/prod/card/field_wear"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import * as fas_check from "@fortawesome/free-solid-svg-icons/faCheck"
import * as faw from "@fortawesome/react-fontawesome"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"

export type ELCN__ProdCardViewInOrder_Props = {
    readonly ref?: r.Ref<HTMLElement | null>

    readonly porder_id: string
    readonly remnode: gs.RemNode<"product">
}

export const ELCN_ProdCardViewInOrder: r.FC<ELCN__ProdCardViewInOrder_Props> = props => {
    const dispatch = gs.useDispatch()
    const rview = gs.useRemView("product", props.remnode)

    const status_pending = (
        rview.pending.del
        || rview.pending.post
    )

    return <article ref={props.ref} className={cl(st.root, st._inorder, status_pending && st._pending)}>
        <rfc.CmpIf value={status_pending}>
            {() => <div className={st.pending}>
                <rbs.Spinner variant={"white"} />
            </div>}
        </rfc.CmpIf>

        <div className={cl(st.field_check)}>
            <button
                className={cl(st.inbool, rview.data.porder_id !== null && st._active)}

                onClick={() => {
                    if (rview.data.porder_id === null) {
                        dispatch(rem.product.act.patch({
                            url: {
                                id: rview.data.id,
                            },

                            body: {
                                porder_id: props.porder_id,
                            },
                        }))
                    } else {
                        dispatch(rem.product.act.patch({
                            url: {
                                id: rview.data.id,
                            },

                            body: {
                                porder_id: null,
                            },
                        }))
                    }
                }}
            >
                <faw.FontAwesomeIcon icon={fas_check.faCheck} />
            </button>
        </div>

        <ELCN_ProdCardFieldKind
            node_id={rview.data.id}
            node_kind={rview.data.kind}
        />

        <ELCN_ProdCardFieldTitle
            node_id={rview.data.id}
            node_spec={rview.data.spec}
            node_title={rview.data.title}
        />

        <ELCN_ProdCardFieldPrice
            node_id={rview.data.id}
            node_price_uah={rview.data.price_uah}
            node_price_usd={rview.data.price_usd}
        />

        <ELCN_ProdCardFieldAvail
            node_id={rview.data.id}
            node_avail={rview.data.status_avail}
        />

        <ELCN_ProdCardFieldWear
            node_id={rview.data.id}
            node_wear={rview.data.status_wear}
        />
    </article>
}

export default ELCN_ProdCardViewInOrder
