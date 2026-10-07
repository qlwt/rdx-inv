import st from "#client/component/feature/cn/style/porder/card/view.module.scss"
import * as r from "react"

export type ELCN__POrderCardFieldProdInfo_Props = {
    readonly product_count: number
    readonly product_price_uah: number
    readonly product_price_usd: number
}

export const ELCN_POrderCardFieldProdInfo: r.FC<ELCN__POrderCardFieldProdInfo_Props> = props => {
    return <div className={st.field_prodinfo}>
        <span className={st.field_prodinfo__count}>
            {props.product_count}
        </span>

        <div className={st.field_prodinfo__delim} />

        <div className={st.field_prodinfo__price}>
            <span className={st.field_prodinfo__price__text}>
                {props.product_price_usd}$
            </span>

            <span className={st.field_prodinfo__price__text}>
                {props.product_price_uah}₴
            </span>
        </div>
    </div>
}

export default ELCN_POrderCardFieldProdInfo
