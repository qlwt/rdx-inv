import * as r from "react"
import st from "#client/component/feature/header/style/view.module.scss"
import * as rbs from "react-bootstrap"
import logo from "#src/assets/img/app/icon.png?url"
import { urlmap } from "#/src/client/urlmap"
import ELHeader_Date from "#/src/client/component/feature/header/local/date"
import ELHeader_Session from "#/src/client/component/feature/header/local/session"
import * as rr from "react-router"

export type EFHeader__View_Props = {

}

export const EFHeader_View: r.FC<EFHeader__View_Props> = props => {
    return <rbs.Navbar className={st.root}>
        <rbs.Container className={`d-flex justify-content-between`}>
            <rr.Link className={st.logo} to={urlmap.home()} viewTransition>
                <img src={logo} width={"54rem"} height={"54rem"} />

                <span className={st.logo__text}>
                    INVENTORY
                </span>
            </rr.Link>

            <div className={st.info}>
                <ELHeader_Session />

                <ELHeader_Date />
            </div>
        </rbs.Container>
    </rbs.Navbar>
}

export default EFHeader_View
