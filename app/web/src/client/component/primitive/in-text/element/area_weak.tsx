import type { EPInText_CRenderProps } from "#/src/client/component/primitive/in-text/type/crender_prop"
import type { EPInText_Mix, EPInText_Size } from "#/src/client/component/primitive/in-text/type/st"
import st from "#client/component/primitive/in-text/style/view.module.scss"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"
import type { z } from "zod"

export type EPInText__AreaWeak_Props = {
    readonly input_id?: string
    readonly input_value: string
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

export const EPInText_AreaWeak: r.FC<EPInText__AreaWeak_Props> = props => {
    const nprop_st_size = props.st_size ?? "normal"
    const nprop_st_mix = props.st_mix ?? "opaque"

    const ref_input = r.useRef<HTMLTextAreaElement | null>(null)
    const value_default = stdr.useConst(props.input_value)

    const [validation, validation_set] = r.useState<boolean>(() => {
        let status_error = false

        if (props.validation_schema && std.zod_isnt(props.validation_schema, props.input_value)) {
            status_error = true
        }

        return status_error
    })

    const validation_update = r.useCallback((next_value: string) => {
        validation_set(validation_old => {
            let status_error = false

            if (props.validation_schema && std.zod_isnt(props.validation_schema, next_value)) {
                status_error = true
            }

            if (status_error !== validation_old) {
                return status_error
            }

            return validation_old
        })
    }, [props.validation_schema])

    r.useLayoutEffect(() => {
        const input = ref_input.current

        if (input) {
            validation_update(input.value)
        }
    }, [validation_update])

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

            props.status_success && st._success,
            (props.status_error || validation) && st._error,

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

            defaultValue={value_default}
            placeholder={props.input_placeholder}

            disabled={props.status_disabled}

            onChange={event => {
                const value = event.target.value

                props.ev_change?.(value)
                validation_update(value)
            }}

            onBlur={props.ev_blur}
        />

        {props.render_after?.(crender_props)}
    </div>
}

export default EPInText_AreaWeak
