import type { EPInText_CRenderProps } from "#/src/client/component/primitive/in-text/type/crender_prop"
import type { EPInText_Mix, EPInText_Size } from "#/src/client/component/primitive/in-text/type/st"
import st from "#client/component/primitive/in-text/style/view.module.scss"
import * as std from "@ta/std"
import cl from "classnames"
import * as r from "react"
import type { z } from "zod"
import * as stdr from "@ta/std-react"

export type EPInText__AreaStrong_Props = {
    readonly input_id?: string
    readonly input_value?: string
    readonly input_placeholder?: string
    readonly input_ref?: stdr.RefI<HTMLTextAreaElement | null>

    readonly cl_row?: string
    readonly cl_input?: string

    readonly status_error?: boolean
    readonly status_success?: boolean
    readonly status_disabled?: boolean

    readonly validation_schema?: z.ZodType

    readonly st_notext?: boolean
    readonly st_mix?: EPInText_Mix
    readonly st_size?: EPInText_Size

    readonly render_after?: (props: EPInText_CRenderProps) => r.ReactNode
    readonly render_before?: (props: EPInText_CRenderProps) => r.ReactNode

    readonly ev_change?: (input: string) => void
    readonly ev_blur?: () => void
}

export const EPInText_AreaStrong: r.FC<EPInText__AreaStrong_Props> = props => {
    const nprop_st_mix = props.st_mix ?? "opaque"
    const nprop_st_size = props.st_size ?? "normal"

    const ref_input = r.useRef<HTMLTextAreaElement | null>(null)

    const status_error = Boolean(
        props.status_error
        || props.validation_schema && std.zod_isnt(props.validation_schema, props.input_value)
    )

    const crender_props = r.useMemo(() => {
        return {
            act_focus: () => {
                ref_input.current?.focus()
            },
        } satisfies EPInText_CRenderProps
    }, [])

    const mref_input = stdr.useRefMerge(ref_input, props.input_ref ?? null)

    return <div
        className={cl(
            st.row_input,
            props.cl_row,

            status_error && st._error,
            props.status_success && st._success,

            props.st_notext && st._notext,
            st[`_mix_${nprop_st_mix}`],
            st[`_size_${nprop_st_size}`],
            props.status_disabled && st._disabled,
        )}
    >
        {props.render_before?.(crender_props)}

        <textarea
            ref={mref_input}
            id={props.input_id}
            className={cl(st.area, props.cl_input)}

            value={props.input_value}
            placeholder={props.input_placeholder}

            disabled={props.status_disabled}

            onChange={event => {
                const value = event.target.value

                props.ev_change?.(value)
            }}

            onBlur={props.ev_blur}
        />

        {props.render_after?.(crender_props)}
    </div>
}

export default EPInText_AreaStrong
