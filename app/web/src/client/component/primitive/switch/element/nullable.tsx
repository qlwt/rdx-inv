import st from "#client/component/primitive/switch/style/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"

export type EPSwitch__Nullable_Props<T> = {
    readonly option_now: std.Maybe<T>
    readonly option_list: readonly T[]
    readonly option_set: std.FnSetterStateles<std.Maybe<T>>
    readonly option_children_new: (option: T) => r.ReactNode
}

export const EPSwitch_Nullable = function <T>(props: EPSwitch__Nullable_Props<T>): r.ReactNode {
    return <div className={st.root}>
        <rfc.CmpLoop data={props.option_list}>
            {option => {
                const status_active = std.maybe_is(props.option_now, option)

                return <button
                    key={`option:${option}`}
                    className={cl(st.case, status_active && st._active)}

                    onClick={() => {
                        if (status_active) {
                            props.option_set(std.MNONE)

                            return
                        }

                        props.option_set(std.maybe_new_some(option))
                    }}
                >
                    {props.option_children_new(option)}
                </button>
            }}
        </rfc.CmpLoop>
    </div>
}

export default EPSwitch_Nullable
