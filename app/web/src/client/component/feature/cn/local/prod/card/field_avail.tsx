import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import st_ddn from "#client/component/feature/cn/style/prod/card/option_line.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import cl from "classnames"
import * as r from "react"

const avail_text_new = function(status_avail: cst.ProductStatus_Avail): string {
    switch (status_avail) {
        case cst.ProductStatus_Avail.Free: {
            return "Available"
        }
        case cst.ProductStatus_Avail.Broken: {
            return "In Repair"
        }
    }
}

export type ELCN__ProdCardFieldAvail_Props = {
    readonly node_id: string
    readonly node_avail: cst.ProductStatus_Avail
}

export const ELCN_ProdCardFieldAvail: r.FC<ELCN__ProdCardFieldAvail_Props> = props => {
    const dispatch = gs.useDispatch()
    const [open, open_set] = r.useState(false)

    return <div className={st.field_avail}>
        <rddn.CmpContainerVirtual open={open} open_set={open_set}>
            <rddn.CmpButton
                className={cl(
                    st.field_avail__text,
                    st_ddn.btn,
                    props.node_avail === cst.ProductStatus_Avail.Free && st._avail_free,
                    props.node_avail === cst.ProductStatus_Avail.Broken && st._avail_broken,
                )}
            >
                {avail_text_new(props.node_avail)}
            </rddn.CmpButton>

            <rddn.CmpListPortal portal={`dropdown-root`} align={"center"} gap={3} className={st_ddn.listc}>
                <rddn.CmpContent className={st_ddn.list}>
                    <button
                        className={cl(st_ddn.item, st_ddn._avail_free)}
                        disabled={props.node_avail === cst.ProductStatus_Avail.Free}

                        onClick={() => {
                            open_set(false)

                            dispatch(rem.product.act.patch({
                                url: {
                                    id: props.node_id,
                                },

                                body: {
                                    status_avail: cst.ProductStatus_Avail.Free,
                                },
                            }))
                        }}
                    >
                        {avail_text_new(cst.ProductStatus_Avail.Free)}
                    </button>

                    <button
                        className={cl(st_ddn.item, st_ddn._avail_broken)}
                        disabled={props.node_avail === cst.ProductStatus_Avail.Broken}

                        onClick={() => {
                            open_set(false)

                            dispatch(rem.product.act.patch({
                                url: {
                                    id: props.node_id,
                                },

                                body: {
                                    status_avail: cst.ProductStatus_Avail.Broken,
                                },
                            }))
                        }}
                    >
                        {avail_text_new(cst.ProductStatus_Avail.Broken)}
                    </button>
                </rddn.CmpContent>
            </rddn.CmpListPortal>
        </rddn.CmpContainerVirtual>
    </div>
}
