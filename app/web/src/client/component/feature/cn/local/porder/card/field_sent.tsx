import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/porder/card/view.module.scss"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as r from "react"
import * as z from "zod"
import * as rfc from "@qyu/reactcmp-flow-control"
import cl from "classnames"

export type ELCN__POrderCardFieldSent_Props = {
    readonly node_id: string
    readonly node_sent_at: number | null
    readonly node_sent_to: string | null

    readonly status_compact: boolean
}

export const ELCN_POrderCardFieldSent: r.FC<ELCN__POrderCardFieldSent_Props> = props => {
    const ref_clock = r.useRef<HTMLInputElement | null>(null)

    const dispatch = gs.useDispatch()

    const [status_hidden, status_hidden_set] = r.useState(false)

    const [date_text, date_value] = r.useMemo(() => {
        if (props.node_sent_at === null) {
            return [
                "Not Sent Yet",
                "",
            ] as const
        }

        const sent_at_date = new Date(props.node_sent_at)
        const sent_at_year = sent_at_date.getFullYear()
        const sent_at_month = (sent_at_date.getMonth() + 1).toString().padStart(2, "0")
        const sent_at_day = sent_at_date.getDate().toString().padStart(2, "0")

        return [
            `${sent_at_day} / ${sent_at_month} / ${sent_at_year}`,
            `${sent_at_year}-${sent_at_month}-${sent_at_day}`
        ] as const
    }, [props.node_sent_at])

    return <div
        className={cl(
            st.field_sent,
            status_hidden && st._hidden,
            props.status_compact && st._compact,
        )}

        onTransitionStart={ev => {
            if (ev.currentTarget !== ev.target) { return }

            switch (ev.nativeEvent.propertyName) {
                case "opacity": {
                    if (!props.status_compact) {
                        status_hidden_set(false)
                    }

                    break
                }
            }
        }}

        onTransitionEnd={ev => {
            if (ev.currentTarget !== ev.target) { return }

            switch (ev.nativeEvent.propertyName) {
                case "opacity": {
                    if (props.status_compact) {
                        status_hidden_set(true)
                    }

                    break
                }
            }
        }}
    >
        <rfc.CmpIf value={props.node_sent_at !== null}>
            {() => <EPEdViewText_View
                text={props.node_sent_to ?? ""}
                placeholder={`No Send Info`}
                validation_schema={z.string().max(cst.porder_limits.sent_to_mxlength)}

                st_notext
                st_size={`small`}
                cl_text={st.field_sent__to}
                cl_text_placeholder={st._placeholder}

                ev_change={tvalue => {
                    dispatch(rem.porder.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            sent_to: tvalue,
                        },
                    }))
                }}
            />}
        </rfc.CmpIf>

        <button
            className={st.field_sent__at}

            onClick={() => {
                const clockin = ref_clock.current

                if (clockin) {
                    clockin.showPicker()
                }
            }}
        >
            {date_text}

            <input
                ref={ref_clock}

                type={`date`}
                className={st.field_sent__at__input}
                value={date_value}

                onChange={ev => {
                    const tvalue = ev.currentTarget.valueAsDate

                    dispatch(rem.porder.act.patch({
                        url: {
                            id: props.node_id,
                        },

                        body: {
                            sent_at: tvalue ? tvalue.getTime() : null,
                        },
                    }))
                }}
            />
        </button>
    </div>
}

export default ELCN_POrderCardFieldSent
