import EPInText_LineWeak from "#/src/client/component/primitive/in-text/element/line_weak"
import type { EPInText_CRenderProps } from "#/src/client/component/primitive/in-text/type/crender_prop"
import type { EPInText_Size } from "#/src/client/component/primitive/in-text/type/st"
import st from "#client/component/primitive/edview-text/style/view.module.scss"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"

export type EPEdViewText__View_Props = {
    readonly text: string
    readonly placeholder?: string

    readonly cl_text?: string
    readonly cl_text_placeholder?: string
    readonly cl_input_row?: string

    readonly st_notext?: boolean
    readonly st_size?: EPInText_Size

    readonly validation?: std.FnPredicate<string>

    readonly ev_blur?: VoidFunction
    readonly ev_change: std.FnSetterStateles<string>

    readonly render_before?: (cprops: null | EPInText_CRenderProps) => r.ReactNode
    readonly render_after?: (cprops: null | EPInText_CRenderProps) => r.ReactNode
}

export const EPEdViewText_View: r.FC<EPEdViewText__View_Props> = props => {
    const nprop_st_size = props.st_size ?? "normal"

    const [edit, edit_set] = r.useState(false)

    const text_trimmed = props.text.trim()

    return <div
        tabIndex={edit ? -1 : 0}

        onFocus={() => {
            edit_set(true)
        }}

        className={cl(
            st.root,
            edit && st._edit,
            st[`_size_${nprop_st_size}`],
            props.st_notext && st._notext,
        )}
    >
        {edit
            ? <EPInText_LineWeak
                input_autofocus
                input_value={props.text}

                ev_change={props.ev_change}

                ev_blur={() => {
                    edit_set(false)
                    props.ev_blur?.()
                }}

                st_size={props.st_size}
                cl_input={props.cl_text}
                cl_row={props.cl_input_row}
                st_notext={props.st_notext}

                validation={props.validation}

                render_after={props.render_after}
                render_before={props.render_before}
            />
            : <>
                {props.render_before?.(null)}

                <div
                    className={cl(
                        st.placeholder,
                        props.cl_text,
                        text_trimmed.length === 0 && props.cl_text_placeholder
                    )}
                >
                    {text_trimmed || props.placeholder}
                </div>

                {props.render_after?.(null)}
            </>
        }
    </div>
}

export default EPEdViewText_View
