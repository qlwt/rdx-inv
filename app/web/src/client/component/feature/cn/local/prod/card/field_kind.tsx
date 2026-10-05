import * as r from "react"
import { asset_cpu_stock, asset_monitor_stock, asset_ram_stock } from "#/src/client/const/assets"
import st from "#client/component/feature/cn/style/prod/card/view.module.scss"
import st_ddn from "#client/component/feature/cn/style/prod/card/option_grid.module.scss"
import * as cst from "@ta/cst"
import * as rddn from "@qyu/reactcmp-dropdown"
import cl from "classnames"
import * as std from "@ta/std"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as rfc from "@qyu/reactcmp-flow-control"

const kind_src_new = function(kind: cst.ProductStatus_Kind) {
    switch (kind) {
        case cst.ProductStatus_Kind.RAM:
            return asset_ram_stock
        case cst.ProductStatus_Kind.CPU:
            return asset_cpu_stock
        case cst.ProductStatus_Kind.Monitor:
            return asset_monitor_stock
    }
}

type EL__DDNItem_Props = {
    readonly prod_id: string
    readonly prod_kind: cst.ProductStatus_Kind
    readonly target_kind: cst.ProductStatus_Kind
    readonly open_set: std.FnSetterStateles<boolean>
}

const EL_KindCard: r.FC<EL__DDNItem_Props> = props => {
    const dispatch = gs.useDispatch()
    const status_disabled = props.prod_kind === props.target_kind

    return <button
        disabled={status_disabled}
        className={st_ddn.item}

        onClick={() => {
            dispatch(rem.product.act.patch({
                url: {
                    id: props.prod_id,
                },

                body: {
                    kind: props.target_kind,
                },
            }))

            props.open_set(false)
        }}
    >
        <img
            draggable={false}
            className={st_ddn.item__img}
            src={kind_src_new(props.target_kind)}
        />
    </button>
}

const kind_list = Object.values(cst.ProductStatus_Kind).filter(n => typeof n === "number")

export type ELCN__ProdCardFieldKind_Props = {
    readonly node_id: string
    readonly node_kind: cst.ProductStatus_Kind
}

export const ELCN_ProdCardFieldKind: r.FC<ELCN__ProdCardFieldKind_Props> = props => {
    const [open, open_set] = r.useState(false)

    return <rddn.CmpContainerVirtual open={open} open_set={open_set}>
        <rddn.CmpButton className={cl(st.field_kind, st_ddn.btn)}>
            <img
                draggable={false}
                className={st.field_kind__img}
                src={kind_src_new(props.node_kind)}
            />
        </rddn.CmpButton>

        <rddn.CmpListPortal portal={`dropdown-root`} align={"center"} gap={3} className={st_ddn.listc}>
            <rddn.CmpContent className={st_ddn.list}>
                <rfc.CmpLoop data={kind_list}>
                    {target_kind => <EL_KindCard
                        key={`kind:${target_kind}`}

                        open_set={open_set}
                        target_kind={target_kind}

                        prod_id={props.node_id}
                        prod_kind={props.node_kind}
                    />}
                </rfc.CmpLoop>
            </rddn.CmpContent>
        </rddn.CmpListPortal>
    </rddn.CmpContainerVirtual>
}

export default ELCN_ProdCardFieldKind
