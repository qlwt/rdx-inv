import { EPIcon_Svg, EPIcon_Svg_Kind } from "#/src/client/component/primitive/icon/element/svg"
import st from "#/src/client/component/primitive/in-bool/style/view.module.scss"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"

export type EPInBool__Strong_Props = {
    readonly value: boolean
    readonly ev_change: std.FnSetterStateles<boolean>
}

export const EPInBool_Strong: r.FC<EPInBool__Strong_Props> = props => {
    return <button
        className={cl(st.root, props.value && st._active)}

        onClick={() => {
            props.ev_change(!props.value)
        }}
    >
        <EPIcon_Svg kind={EPIcon_Svg_Kind.Check} />
    </button>
}

export default EPInBool_Strong
