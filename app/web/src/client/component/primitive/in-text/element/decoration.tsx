import type { EPInText_Size } from "#/src/client/component/primitive/in-text/type/st"
import st from "#client/component/primitive/in-text/style/decoration.module.scss"
import * as r from "react"
import cl from "classnames"

export type EPInText__BtnEye_Props = {
    readonly ev_press?: VoidFunction

    readonly st_notext?: boolean
    readonly st_size?: EPInText_Size

    readonly children?: r.ReactNode
}

export const EPInText_Decoration: r.FC<EPInText__BtnEye_Props> = props => {
    const nprop_st_size = props.st_size ?? "normal"

    return <div
        onClick={props.ev_press}

        className={cl(
            st.root,
            st[`_size_${nprop_st_size}`],
            props.st_notext && st._notext,
        )}
    >
        {props.children}
    </div>
}
