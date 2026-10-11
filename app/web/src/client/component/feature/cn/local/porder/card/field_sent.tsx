import EPEdViewText_View from "#/src/client/component/primitive/edview-text/element/view"
import st from "#client/component/feature/cn/style/porder/card/field_sent.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as cst from "@ta/cst"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

const validator_sent_to = (str: string) => {
    return str.length <= cst.porder_limits.sent_to_mxlength
}

export type ELCN__POrderCardFieldSent_Props = {
    readonly node_id: string
    readonly node_sent_at: number | null
    readonly node_sent_to: string | null

    readonly status_compact: boolean
}

export const ELCN_POrderCardFieldSent: r.FC<ELCN__POrderCardFieldSent_Props> = props => {
    const dispatch = gs.useDispatch()
    const { t } = ri18.useTranslation()

    const ref_clock = r.useRef<HTMLInputElement | null>(null)
    const throttle_sent_to = stdr.useConstLazy(() => std.throttler_new_delay(500))

    const [status_hidden, status_hidden_set] = r.useState(false)

    const [date_text, date_value] = r.useMemo(() => {
        if (props.node_sent_at === null) {
            return [
                t(`cn.grid.card.ph_sent_at`),
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
            st.root,
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
                placeholder={t(`cn.grid.card.ph_sent_to`)}
                validation={validator_sent_to}
                text={props.node_sent_to ?? ""}

                st_notext
                st_size={`small`}
                cl_text={st.to}
                cl_text_placeholder={st._placeholder}

                ev_change={tvalue => {
                    if (!validator_sent_to(tvalue)) { return }

                    throttle_sent_to.emit(() => {
                        dispatch(rem.porder.act.patch({
                            url: {
                                id: props.node_id,
                            },

                            body: {
                                sent_to: tvalue,
                            },
                        }))
                    })
                }}

                ev_blur={() => {
                    throttle_sent_to.flush()
                }}
            />}
        </rfc.CmpIf>

        <button
            className={st.at}

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
                className={st.at__input}
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
