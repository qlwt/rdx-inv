import st from "#client/component/feature/header/style/session.module.scss"
import * as r from "react"
import * as gs from "@ta/gstate"
import { gl } from "@ta/gstate"

export type ELHeader__Session_Props = {

}

export const ELHeader_Session: r.FC<ELHeader__Session_Props> = props => {
    const counter = gs.useSelect(gl.session.sel.counter)

    return <span className={st.root}>
        {counter === null ? `loading...` : `${counter} onpage`}
    </span>
}

export default ELHeader_Session
