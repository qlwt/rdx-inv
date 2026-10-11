import st from "#client/component/feature/header/style/session.module.scss"
import * as r from "react"
import * as gs from "@ta/gstate"
import { gl } from "@ta/gstate"
import * as ri18 from "react-i18next"

export type ELHeader__Session_Props = {

}

export const ELHeader_Session: r.FC<ELHeader__Session_Props> = props => {
    const { t, } = ri18.useTranslation()
    const counter = gs.useSelect(gl.session.sel.counter)

    return <span className={st.root}>
        {counter === null ? t("header.counter_loading") : t("header.counter_active", { count: counter })}
    </span>
}

export default ELHeader_Session
