import type { EPInText_CRenderProps } from "#/src/client/component/primitive/in-text/type/crender_prop"
import type { EPInText_Mix, EPInText_Size } from "#/src/client/component/primitive/in-text/type/st"
import st from "#client/component/primitive/in-text/style/view.module.scss"
import st_stabs from "#client/component/primitive/stabs/style/stabs.module.scss"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"
import type { z } from "zod"

export type EPInText__LineWeakInline_Props = {
    readonly input_id?: string
    readonly input_value: string
    readonly input_placeholder?: string
    readonly input_type?: "text" | "password"
    readonly input_ref?: stdr.RefI<HTMLInputElement | null>

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

    readonly ev_blur?: () => void
    readonly ev_change?: (input: string) => void
}

export const EPInText_LineWeakInline: r.FC<EPInText__LineWeakInline_Props> = props => {
    const nprop_st_mix = props.st_mix ?? "opaque"
    const nprop_st_size = props.st_size ?? "normal"

    const ref_stabs = r.useRef<HTMLDivElement | null>(null)
    const ref_input = r.useRef<HTMLInputElement | null>(null)
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

    r.useLayoutEffect(() => {
        if (ref_stabs.current && ref_input.current) {
            ref_stabs.current.textContent = ref_input.current.value || "1"
        }
    }, [])

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
            st.root,
            props.cl_row,

            props.status_success && st._success,
            (props.status_error || validation) && st._error,

            st[`_mix_${nprop_st_mix}`],
            st[`_size_${nprop_st_size}`],
            props.st_notext && st._notext,
            props.status_disabled && st._disabled,
        )}
    >
        {props.render_before?.(crender_props)}

        <div className={st_stabs.root}>
            <div
                ref={ref_stabs}

                className={cl(
                    st.line,
                    st.placeholder,
                    props.cl_input,
                    st_stabs.item,
                    st_stabs._hidden
                )}
            />

            <div className={cl(st_stabs.root, st_stabs.item, st_stabs._passive)}>
                <input
                    ref={mref_input}

                    id={props.input_id}
                    type={props.input_type || "text"}
                    className={cl(st.line, props.cl_input)}

                    defaultValue={value_default}
                    placeholder={props.input_placeholder}

                    disabled={props.status_disabled}

                    onChange={event => {
                        const tvalue = event.target.value

                        props.ev_change?.(tvalue)
                        validation_update(tvalue)

                        if (ref_stabs.current) {
                            ref_stabs.current.textContent = tvalue || "0"
                        }
                    }}

                    onBlur={props.ev_blur}
                />
            </div>
        </div>

        {props.render_after?.(crender_props)}
    </div>
}

export default EPInText_LineWeakInline
