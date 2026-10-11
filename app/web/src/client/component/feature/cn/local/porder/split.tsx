import ELCN_FilterPGroup from "#/src/client/component/feature/cn/local/filter/pgroup"
import ELCN_Grid from "#/src/client/component/feature/cn/local/grid"
import ELCN_POrderCardView from "#/src/client/component/feature/cn/local/porder/card/view"
import ELCN_ProdCardViewInOrder from "#/src/client/component/feature/cn/local/prod/card/view_inorder"
import st_switch from "#/src/client/component/feature/cn/style/filter/switch.module.scss"
import { EPIcon_Svg, EPIcon_Svg_Kind } from "#/src/client/component/primitive/icon/element/svg"
import EPSwitch_Nullable from "#/src/client/component/primitive/switch/element/nullable"
import st_filter from "#client/component/feature/cn/style/filter/view.module.scss"
import st from "#client/component/feature/cn/style/porder/split.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as stdr from "@ta/std-react"

const pick_none = {}

type SelectionState = {
    readonly id: std.Maybe<string>
    readonly status_closing: boolean
}

export type ELCN__POrderSplit_Props = {
    readonly deletion_set: std.FnSetterStateles<std.Maybe<{ id: string, action: VoidFunction, }>>
}

export const ELCN_POrderSplit: r.FC<ELCN__POrderSplit_Props> = props => {
    const { t } = ri18.useTranslation()

    const ref_container = r.useRef<HTMLDivElement | null>(null)
    const container_size = stdr.useSizeObserver({
        refo_target: stdr.useRefO(ref_container),

        ignore: {
            height: true,
        },
    })

    const [left_hide, left_hide_set] = r.useState(false)
    const [selection, selection_set] = r.useState<SelectionState>({ id: std.MNONE, status_closing: false, })

    const [pick_instock, pick_instock_set] = r.useState<std.Maybe<true>>(std.MNONE)
    const [pick_wear, pick_wear_set] = r.useState<std.Maybe<cst.ProductStatus_Wear>>(std.MNONE)
    const [pick_avail, pick_avail_set] = r.useState<std.Maybe<cst.ProductStatus_Avail>>(std.MNONE)
    const [pick_pgroup, pick_pgroup_set] = r.useState<std.Maybe<string>>(std.MNONE)

    const pick_product = r.useMemo(() => {
        return {
            pgroup_id: std.maybe_unpack(pick_pgroup, undefined),
            status_wear: std.maybe_unpack(pick_wear, undefined),
            status_avail: std.maybe_unpack(pick_avail, undefined),

            porder_id: std.maybe_unpack(
                std.maybe_new_map(pick_instock, () => null),
                std.maybe_unpack(selection.id, undefined)
            ),
        } satisfies NonNullable<capi.SendMGet_Query<"product">["pick"]>
    }, [pick_avail, pick_wear, pick_instock, pick_pgroup, selection.id])

    const status_open = (
        selection.id.kind
        && !selection.status_closing
    )

    const card_deletion_set = r.useCallback((id_m: std.Maybe<string>) => {
        props.deletion_set(std.maybe_new_map(id_m, id => ({
            id,
            action: () => {
                selection_set({
                    id: id_m,
                    status_closing: true,
                })
            },
        })))
    }, [selection_set, props.deletion_set])

    return <div
        ref={ref_container}
        className={cl(st.split, status_open && st._open)}

        style={{
            ["--cn-porder-split-width" as never]: `${container_size?.width ?? 1000}px`
        }}

        onTransitionEnd={ev => {
            if (ev.currentTarget !== ev.target) { return }

            if (selection.status_closing) {
                switch (ev.nativeEvent.propertyName) {
                    case "column-gap":
                    case "row-gap":
                    case "gap": {
                        selection_set({
                            id: std.MNONE,
                            status_closing: false,
                        })

                        break
                    }
                }
            }
        }}
    >
        <div
            className={cl(st.split__left, status_open && st._open, left_hide && st._hide)}

            onTransitionStart={ev => {
                if (ev.currentTarget !== ev.target) { return }

                switch (ev.nativeEvent.propertyName) {
                    case "flex-grow": {
                        left_hide_set(false)

                        break
                    }
                }
            }}

            onTransitionEnd={ev => {
                if (ev.currentTarget !== ev.target) { return }

                switch (ev.nativeEvent.propertyName) {
                    case "flex-grow": {
                        const comp = window.getComputedStyle(ev.currentTarget)

                        if (comp.flexGrow === "0") {
                            left_hide_set(true)
                        }

                        break
                    }
                }
            }}
        >
            <ELCN_Grid
                kind={`flex`}
                pick={pick_none}
                target={"porder"}
                placeholder={t(`cn.grid.ph_porder`)}

                render_child={(remnode, refi) => {
                    return <ELCN_POrderCardView
                        ref={refi}
                        key={remnode.id}

                        remnode={remnode}
                        status_compact={status_open}
                        deletion_set={card_deletion_set}
                        status_selected={!selection.status_closing && std.maybe_is(selection.id, remnode.id)}

                        selection_set={(selection_id) => {
                            if (selection_id.kind) {
                                selection_set({
                                    id: selection_id,
                                    status_closing: false,
                                })
                            } else {
                                selection_set(selection_old => ({
                                    ...selection_old,
                                    status_closing: true,
                                }))
                            }
                        }}
                    />
                }}
            />
        </div>

        <div className={cl(st.split__right, status_open && st._open)}>
            <div className={st.split__right__container}>
                <div className={st_filter.row}>
                    <div className={st_filter.list}>
                        <button
                            className={st.act}

                            onClick={() => {
                                selection_set(selection_old => ({
                                    ...selection_old,

                                    status_closing: true,
                                }))
                            }}
                        >
                            <EPIcon_Svg kind={EPIcon_Svg_Kind.ArrowLeft} />
                        </button>

                        <EPSwitch_Nullable
                            root_className={st_switch.root}

                            option_now={pick_avail}
                            option_set={pick_avail_set}
                            option_list={[cst.ProductStatus_Avail.Free] as const}

                            option_children_new={() => {
                                return t(`cn.grid.filter.avail_free`)
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

                            option_now={pick_instock}
                            option_set={pick_instock_set}
                            option_list={[true] as const}

                            option_children_new={() => {
                                return t(`cn.grid.filter.add_products`)
                            }}
                        />
                    </div>

                    <div className={st_filter.list}>
                        <ELCN_FilterPGroup
                            selection={pick_pgroup}
                            selection_set={pick_pgroup_set}
                        />
                    </div>
                </div>

                <rfc.CmpRequire value={[std.maybe_unpack(selection.id, null)] as const}>
                    {([selection]) => <ELCN_Grid
                        kind={`flex`}
                        target={"product"}
                        pick={pick_product}
                        placeholder={t(`cn.grid.ph_product`)}

                        render_child={(remnode, refi) => {
                            return <ELCN_ProdCardViewInOrder
                                ref={refi}
                                key={remnode.id}

                                remnode={remnode}
                                porder_id={selection}
                            />
                        }}
                    />}
                </rfc.CmpRequire>
            </div>
        </div>
    </div>
}

export default ELCN_POrderSplit
