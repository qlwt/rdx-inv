import st from "#client/component/feature/cn/style/porder/card/field_prodinfo.module.scss"
import * as r from "react"

export type ELCN__POrderCardFieldProdInfo_Props = {
    readonly product_count: number
    readonly product_price_uah: number
    readonly product_price_usd: number
}

export const ELCN_POrderCardFieldProdInfo: r.FC<ELCN__POrderCardFieldProdInfo_Props> = props => {
    return <div className={st.root}>
        <span className={st.count}>
            {props.product_count}
        </span>

        <div className={st.delim} />

        <div className={st.price}>
            <div className={st.price__text}>
                <span className={st.price__digits}>
                    {props.product_price_usd}
                </span>

                <span className={st.price__sign}>
                    $
                </span>
            </div>

            <div className={st.price__text}>
                <span className={st.price__digits}>
                    {props.product_price_uah}
                </span>

                <span className={st.price__sign}>
                    ₴
                </span>
            </div>
        </div>
    </div>
}

export default ELCN_POrderCardFieldProdInfo
