import { ELCN_ProdCardFieldAvail } from "#/src/client/component/feature/cn/local/prod/card/field_avail"
import ELCN_ProdCardFieldPGroup from "#/src/client/component/feature/cn/local/prod/card/field_pgroup"
import { ELCN_ProdCardFieldPrice } from "#/src/client/component/feature/cn/local/prod/card/field_price"
import { ELCN_ProdCardFieldTitle } from "#/src/client/component/feature/cn/local/prod/card/field_title"
import { ELCN_ProdCardFieldWear } from "#/src/client/component/feature/cn/local/prod/card/field_wear"
import { EPIcon_Svg, EPIcon_Svg_Kind } from "#/src/client/component/primitive/icon/element/svg"
import EPPending_Screen from "#/src/client/component/primitive/pending/element/screen"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELCN__ProdCardView_Props = {
    readonly ref?: r.Ref<HTMLElement | null>
    readonly remnode: gs.RemNode<"product">
    readonly deletion_set: (id: std.Maybe<string>) => void
}

export const ELCN_ProdCardView: r.FC<ELCN__ProdCardView_Props> = props => {
    const { t } = ri18.useTranslation()
    const rview = gs.useRemView("product", props.remnode)

    const status_free = (
        rview.data.status_avail === cst.ProductStatus_Avail.Free
        && rview.data.porder_id === null
    )

    const status_pending = (
        rview.pending.del
        || rview.pending.post
    )

    return <article ref={props.ref} className={cl(st.root, st._full, status_pending && st._pending)}>
        <rfc.CmpIf value={status_pending}>
            {() => <EPPending_Screen />}
        </rfc.CmpIf>

        <div
            className={cl(
                st.field_indicator,
                status_free ? st._green : st._red,
            )}
        />

        <ELCN_ProdCardFieldPGroup
            node_id={rview.data.id}
            node_pgroup_id={rview.data.pgroup_id}
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

        <div
            className={cl(
                st.field_porder,
                rview.data.porder_id === null && st._instock,
                rview.data.porder_id !== null && st._ordered,
            )}
        >
            {rview.data.porder_id === null ? t("cn.grid.filter.order_none") : t("cn.grid.filter.order_placed")}
        </div>

        <ELCN_ProdCardFieldAvail
            node_id={rview.data.id}
            node_avail={rview.data.status_avail}
        />

        <ELCN_ProdCardFieldWear
            node_id={rview.data.id}
            node_wear={rview.data.status_wear}
        />

        <div className={st.field_act}>
            <button
                className={cl(st.field_act__act, st._delete)}
                aria-label={`delete product ${rview.data.title}`}

                onClick={() => {
                    props.deletion_set(std.maybe_new_some(rview.data.id))
                }}
            >
                <EPIcon_Svg kind={EPIcon_Svg_Kind.Trash} />
            </button>
        </div>
    </article>
}

export default ELCN_ProdCardView
