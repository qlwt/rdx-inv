import st from "#client/component/primitive/switch/style/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"

export type EPSwitch__Required_Props<T> = {
    readonly root_className?: string
    readonly case_className?: string

    readonly option_now: T
    readonly option_list: readonly T[]
    readonly option_set: std.FnSetterStateles<T>
    readonly option_children_new: (option: T) => r.ReactNode
}

export const EPSwitch_Required = function <T>(props: EPSwitch__Required_Props<T>): r.ReactNode {
    return <div className={cl(st.root, props.root_className)}>
        <rfc.CmpLoop data={props.option_list}>
            {option => {
                const status_active = props.option_now === option

                return <button
                    key={`option:${option}`}
                    disabled={status_active}
                    className={cl(st.case, status_active && st._active)}

                    onClick={() => {
                        props.option_set(option)
                    }}
                >
                    {props.option_children_new(option)}
                </button>
            }}
        </rfc.CmpLoop>
    </div>
}

export default EPSwitch_Required
