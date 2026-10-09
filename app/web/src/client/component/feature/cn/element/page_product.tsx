import ELCN_FilterPGroup from "#/src/client/component/feature/cn/local/filter/pgroup"
import st_switch from "#/src/client/component/feature/cn/style/filter/switch.module.scss"
import ELCN_Grid from "#/src/client/component/feature/cn/local/grid"
import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_ProdCardView from "#/src/client/component/feature/cn/local/prod/card/view"
import EPSwitch_Nullable from "#/src/client/component/primitive/switch/element/nullable"
import st from "#client/component/feature/cn/style/page.module.scss"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as rbs from "react-bootstrap"

export type EFCN_PageProduct_Props = {

}

export const EFCN_PageProduct: r.FC<EFCN_PageProduct_Props> = props => {
    const dispatch = gs.useDispatch()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    const [pick_pgroup, pick_pgroup_set] = r.useState<std.Maybe<string>>(std.MNONE)
    const [pick_porder, pick_porder_set] = r.useState<std.Maybe<null>>(std.MNONE)
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

    return <main className={st.root}>
        <ELCN_Head
            pick={pick}
            target={"product"}
            title={`Products`}

            ev_post={() => {
                dispatch(rem.product.act.post({
                    body: {
                        status_wear: std.maybe_unpack(pick_wear, cst.ProductStatus_Wear.New),
                        status_avail: std.maybe_unpack(pick_avail, cst.ProductStatus_Avail.Free),

                        title: "New Product",
                        spec: "",
                        price_uah: 100,
                        price_usd: 100,

                        pgroup_id: null,
                        porder_id: null,
                    },
                }))
            }}
        />

        <div className={st.filter_list}>
            <EPSwitch_Nullable
                root_className={st_switch.root}
                option_now={pick_avail}
                option_set={pick_avail_set}
                option_list={[cst.ProductStatus_Avail.Free, cst.ProductStatus_Avail.Broken] as const}

                option_children_new={option => {
                    switch (option) {
                        case cst.ProductStatus_Avail.Free:
                            return "Available"
                        case cst.ProductStatus_Avail.Broken:
                            return "In Repair"
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
                            return "New"
                        case cst.ProductStatus_Wear.Used:
                            return "Used"
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
                            return "In Stock"
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
            placeholder={`No Products Added`}

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
                Do you really want to delete that item?
            </rbs.Modal.Header>

            <rbs.Modal.Footer>
                <rbs.Button
                    variant={`primary`}

                    onClick={() => {
                        deletion_set(std.MNONE)
                    }}
                >
                    Cancel
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
                    Delete
                </rbs.Button>
            </rbs.Modal.Footer>
        </rbs.Modal>
    </main>
}

export default EFCN_PageProduct
