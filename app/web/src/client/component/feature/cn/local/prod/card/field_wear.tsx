import st_ddn from "#client/component/feature/cn/style/prod/card/option_line.module.scss"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import cl from "classnames"

const wear_text_new = function(status_wear: cst.ProductStatus_Wear): string {
    switch (status_wear) {
        case cst.ProductStatus_Wear.New:
            return "New"
        case cst.ProductStatus_Wear.Used:
            return "Used"
    }
}

export type ELCN__ProdCardFieldWear_Props = {
    readonly node_id: string
    readonly node_wear: cst.ProductStatus_Wear
}

export const ELCN_ProdCardFieldWear: r.FC<ELCN__ProdCardFieldWear_Props> = props => {
    const dispatch = gs.useDispatch()
    const [open, open_set] = r.useState(false)

    return <div className={st.field_wear}>
        <rddn.CmpContainerVirtual open={open} open_set={open_set}>
            <rddn.CmpButton className={cl(st.field_wear__btn, st.field_wear__text)}>
                {wear_text_new(props.node_wear)}
            </rddn.CmpButton>

            <rddn.CmpListPortal portal={`dropdown-root`} align={"center"} gap={3} className={st_ddn.listc}>
                <rddn.CmpContent className={st_ddn.list}>
                    <button
                        className={st_ddn.item}
                        disabled={props.node_wear === cst.ProductStatus_Wear.New}

                        onClick={() => {
                            open_set(false)

                            dispatch(rem.product.act.patch({
                                url: {
                                    id: props.node_id,
                                },

                                body: {
                                    status_wear: cst.ProductStatus_Wear.New,
                                },
                            }))
                        }}
                    >
                        {wear_text_new(cst.ProductStatus_Wear.New)}
                    </button>

                    <button
                        className={st_ddn.item}
                        disabled={props.node_wear === cst.ProductStatus_Wear.Used}

                        onClick={() => {
                            open_set(false)

                            dispatch(rem.product.act.patch({
                                url: {
                                    id: props.node_id,
                                },

                                body: {
                                    status_wear: cst.ProductStatus_Wear.Used,
                                },
                            }))
                        }}
                    >
                        {wear_text_new(cst.ProductStatus_Wear.Used)}
                    </button>
                </rddn.CmpContent>
            </rddn.CmpListPortal>
        </rddn.CmpContainerVirtual>
    </div>
}
