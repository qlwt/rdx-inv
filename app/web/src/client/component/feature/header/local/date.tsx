import st from "#client/component/feature/header/style/date.module.scss"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as i18 from "i18next"

const day_name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
const month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

const text_new_day = function(t: i18.TFunction<"translation", undefined>): string {
    const date_now = new Date()
    const weekday = date_now.getDay()

    return t(`day.${day_name[weekday]!}`)
}

const text_new_date = function(t: i18.TFunction<"translation", undefined>): string {
    const date_now = new Date()
    const monthday = date_now.getDate()
    const month = date_now.getMonth()
    const year = date_now.getFullYear()

    return `${monthday} ${t(`month.${month_name[month]!}`)}. ${year}`
}

const text_new_time = function(): string {
    const date_now = new Date()
    const hours = date_now.getHours().toString().padStart(2, "0")
    const minutes = date_now.getMinutes().toString().padStart(2, "0")

    return `${hours}:${minutes}`
}

const rotation_new = function(): string {
    return `${Math.trunc(new Date().getSeconds() / 60 * 360)}deg`
}

const listen_day = function(cb: VoidFunction): VoidFunction {
    let id: NodeJS.Timeout

    const listen = () => {
        const nextd = new Date()

        nextd.setHours(0, 0, 0, 0)
        nextd.setDate(nextd.getDate() + 1)

        return setTimeout(() => {
            cb()

            id = listen()
        }, nextd.getTime() - Date.now())
    }

    id = listen()

    return () => {
        clearTimeout(id)
    }
}

const listen_minute = function(cb: VoidFunction): VoidFunction {
    let id: NodeJS.Timeout

    const listen = () => {
        const date_now = new Date()

        return setTimeout(() => {
            cb()

            id = listen()
        }, 60 - date_now.getSeconds())
    }

    id = listen()

    return () => {
        clearTimeout(id)
    }
}

const listen_second = function(cb: VoidFunction): VoidFunction {
    let id: NodeJS.Timeout

    const listen = () => {
        const date_now = new Date()

        return setTimeout(() => {
            cb()

            id = listen()
        }, 1000 - date_now.getMilliseconds())
    }

    id = listen()

    return () => {
        clearTimeout(id)
    }
}

export type ELHeader__Date_Props = {

}

export const ELHeader_Date: r.FC<ELHeader__Date_Props> = props => {
    const { t } = ri18.useTranslation()
    const ref_clock = r.useRef<HTMLDivElement | null>(null)
    const ref_time = r.useRef<HTMLElement | null>(null)
    const ref_date_top = r.useRef<HTMLElement | null>(null)
    const ref_date_bottom = r.useRef<HTMLElement | null>(null)

    r.useEffect(() => {
        const clean_day = listen_day(() => {
            const date_top = ref_date_top.current
            const date_bottom = ref_date_bottom.current

            if (date_top) {
                date_top.textContent = text_new_day()
            }

            if (date_bottom) {
                date_bottom.textContent = text_new_date()
            }
        })

        const clean_hour = listen_minute(() => {
            const time = ref_time.current

            if (time) {
                time.textContent = text_new_time()
            }
        })

        const clean_second = listen_second(() => {
            const clock = ref_clock.current

            if (clock) {
                clock.style.setProperty("--rotation", rotation_new())
            }
        })

        return () => {
            clean_day()
            clean_hour()
            clean_second()
        }
    }, [])

    return <div className={st.root}>
        <div className={st.time}>
            <span ref={ref_time} className={st.time__text}>
                {text_new_time()}
            </span>

            <div
                ref={ref_clock}
                className={st.time__clock}

                style={{
                    [`--rotation` as never]: rotation_new(),
                }}
            />
        </div>

        <div className={st.date}>
            <span ref={ref_date_top} className={st.date__top}>
                {text_new_day(t)}
            </span>

            <br />

            <span ref={ref_date_bottom} className={st.date__bottom}>
                {text_new_date(t)}
            </span>
        </div>
    </div>
}

export default ELHeader_Date
