import ELCN_FilterPGroup from "#/src/client/component/feature/cn/local/filter/pgroup"
import ELCN_Grid from "#/src/client/component/feature/cn/local/grid"
import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_ProdCardView from "#/src/client/component/feature/cn/local/prod/card/view"
import st_switch from "#/src/client/component/feature/cn/style/filter/switch.module.scss"
import EPSwitch_Nullable from "#/src/client/component/primitive/switch/element/nullable"
import st_filter from "#client/component/feature/cn/style/filter/view.module.scss"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"
import * as ri18 from "react-i18next"

export type EFCN_PageProduct_Props = {

}

export const EFCN_PageProduct: r.FC<EFCN_PageProduct_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = gs.useDispatch()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    const [pick_porder, pick_porder_set] = r.useState<std.Maybe<null>>(std.MNONE)
    const [pick_pgroup, pick_pgroup_set] = r.useState<std.Maybe<string>>(std.MNONE)
    const [pick_wear, pick_wear_set] = r.useState<std.Maybe<cst.ProductStatus_Wear>>(std.MNONE)
    const [pick_avail, pick_avail_set] = r.useState<std.Maybe<cst.ProductStatus_Avail>>(std.MNONE)

    const pick = r.useMemo(() => {
        return {
            pgroup_id: std.maybe_unpack(pick_pgroup, undefined),
            porder_id: std.maybe_unpack(pick_porder, undefined),
            status_wear: std.maybe_unpack(pick_wear, undefined),
            status_avail: std.maybe_unpack(pick_avail, undefined),
        } satisfies capi.SendMGet_Query<"product">["pick"]
    }, [pick_wear, pick_avail, pick_porder, pick_pgroup])

    return <>
        <ELCN_Head
            pick={pick}
            target={"product"}
            title={t(`cn.head.product`)}

            ev_post={() => {
                dispatch(rem.product.act.post({
                    body: {
                        status_wear: std.maybe_unpack(pick_wear, cst.ProductStatus_Wear.New),
                        status_avail: std.maybe_unpack(pick_avail, cst.ProductStatus_Avail.Free),

                        title: "",
                        spec: "",
                        price_uah: 0,
                        price_usd: 0,

                        porder_id: null,
                        pgroup_id: std.maybe_unpack(pick_pgroup, null),
                    },
                }))
            }}
        />

        <div className={cl(st_filter.list, st_filter._wrapping)}>
            <EPSwitch_Nullable
                root_className={st_switch.root}
                option_now={pick_avail}
                option_set={pick_avail_set}
                option_list={[cst.ProductStatus_Avail.Free, cst.ProductStatus_Avail.Broken] as const}

                option_children_new={option => {
                    switch (option) {
                        case cst.ProductStatus_Avail.Free:
                            return t(`cn.grid.filter.avail_free`)
                        case cst.ProductStatus_Avail.Broken:
                            return t(`cn.grid.filter.avail_broken`)
                    }
                }}
            />

            <EPSwitch_Nullable
                root_className={st_switch.root}
                option_now={pick_wear}
                option_set={pick_wear_set}
                option_list={[cst.ProductStatus_Wear.New, cst.ProductStatus_Wear.Used] as const}

                option_children_new={option => {
                    switch (option) {
                        case cst.ProductStatus_Wear.New:
                            return t(`cn.grid.filter.wear_new`)
                        case cst.ProductStatus_Wear.Used:
                            return t(`cn.grid.filter.wear_used`)
                    }
                }}
            />

            <EPSwitch_Nullable
                root_className={st_switch.root}
                option_now={pick_porder}
                option_set={pick_porder_set}
                option_list={[null] as const}

                option_children_new={option => {
                    switch (option) {
                        case null:
                            return t(`cn.grid.filter.order_none`)
                    }
                }}
            />

            <ELCN_FilterPGroup
                selection={pick_pgroup}
                selection_set={pick_pgroup_set}
            />
        </div>

        <ELCN_Grid
            pick={pick}
            kind={`flex`}
            target={"product"}
            placeholder={t(`cn.grid.ph_product`)}

            render_child={(remnode, refi) => {
                return <ELCN_ProdCardView
                    key={remnode.id}

                    ref={refi}
                    remnode={remnode}
                    deletion_set={deletion_set}
                />
            }}
        />

        <rbs.Modal show={deletion.kind} onHide={() => deletion_set(std.MNONE)}>
            <rbs.Modal.Header>
                {t(`cn.grid.modal.del_product`)}
            </rbs.Modal.Header>

            <rbs.Modal.Footer>
                <rbs.Button
                    variant={`primary`}

                    onClick={() => {
                        deletion_set(std.MNONE)
                    }}
                >
                    {t(`cn.grid.modal.cancel`)}
                </rbs.Button>

                <rbs.Button
                    variant={`delete`}

                    onClick={() => {
                        if (!deletion.kind) { return }

                        dispatch(rem.product.act.delete({
                            url: {
                                id: deletion.value,
                            },
                        }))

                        deletion_set(std.MNONE)
                    }}
                >
                    {t(`cn.grid.modal.confirm`)}
                </rbs.Button>
            </rbs.Modal.Footer>
        </rbs.Modal>
    </>
}

export default EFCN_PageProduct
