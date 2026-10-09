import EPVirtual_LMonDyn from "#/src/client/component/primitive/virtual/element/lmondyn"
import st from "#client/component/feature/cn/style/grid.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as capi from "@ta/capi"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"

type PickMeta = {
    readonly cache: Map<string, boolean>
    readonly entry_list: [string, any][]
}

export type ELCN__Grid_Props<Target extends gs.RemKey> = {
    readonly target: Target
    readonly placeholder: string
    readonly kind: "flex" | "pgroup"
    readonly pick: NonNullable<capi.SendMGet_Query<Target>["pick"]>
    readonly render_child: (remnode: gs.RemNode<Target>, refi: stdr.RefI<HTMLElement | null> | null) => r.ReactNode
}

export const ELCN_Grid = function <Target extends gs.RemKey>(props: ELCN__Grid_Props<Target>): r.ReactNode {
    const pagnode = gs.usePagNode(props.target, props.pick)
    const remnode_list = gs.useSelect(rem[props.target as "product"].sel.selectAll) as gs.RemNode<Target>[]

    const pick_meta = r.useMemo<PickMeta>(() => {
        const entry_list: PickMeta["entry_list"] = []

        for (const entry of Object.entries(props.pick)) {
            if (entry[1] !== undefined) {
                entry_list.push(entry)
            }
        }

        return {
            entry_list,
            cache: new Map<string, boolean>(),
        }
    }, [props.pick])

    const remnode_list_fit = r.useMemo(() => {
        const result: gs.RemNode<Target>[] = []
        const cursor = pagnode ? pagnode.cursor : std.MNONE

        if (pick_meta.entry_list.length >= 1) {
            for (const remnode of remnode_list) {
                if (!cursor.kind || cursor.value !== null && remnode.id <= cursor.value) {
                    break
                }

                if (pick_meta.entry_list.length >= 1) {
                    let validation = pick_meta.cache.get(remnode.id)

                    if (typeof validation !== "boolean") {
                        validation = true

                        for (const entry of pick_meta.entry_list) {
                            if (remnode[entry[0] as never] !== entry[1]) {
                                validation = false

                                break
                            }
                        }

                        pick_meta.cache.set(remnode.id, validation)
                    }

                    if (!validation) {
                        continue
                    }
                }

                result.push(remnode)
            }
        } else {
            for (const remnode of remnode_list) {
                if (!cursor.kind || cursor.value !== null && remnode.id <= cursor.value) {
                    break
                }

                result.push(remnode)
            }
        }

        return result
    }, [remnode_list, pick_meta, pagnode, props.render_child])

    const pagination_loader = gs.usePagLoader(props.target, {
        limit: 20,
        pick: props.pick,
        status_active: true,
    })

    return <>
        <rfc.CmpIf value={remnode_list_fit.length === 0 && pagnode && std.maybe_is(pagnode.cursor, null)}>
            <div className={st.placeholder}>
                {props.placeholder}
            </div>
        </rfc.CmpIf>

        <EPVirtual_LMonDyn
            window_buffer={1}
            src_length={remnode_list_fit.length}

            container_render={lprops => {
                return <div {...lprops} className={cl(lprops.className, st.container)} />
            }}

            grid_render={lprops => {
                return <div {...lprops} className={cl(lprops.className, st.root, st[`_${props.kind}`])} />
            }}

            src_render={(index, refi) => {
                return props.render_child(remnode_list_fit[index]!, refi)
            }}

            pagination={{
                threashhold: 1,
                deps: [props.pick],
                load: pagination_loader,

                status: (() => {
                    if (!pagnode || !pagnode.cursor.kind) { return "idle" }
                    if (pagnode.cursor.value === null) { return "fulfilled" }
                    if (pagnode.status_pending) { return "pending" }

                    return "idle"
                })(),
            }}
        />
    </>
}

export default ELCN_Grid
