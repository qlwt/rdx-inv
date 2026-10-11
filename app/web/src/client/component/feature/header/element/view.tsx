import ELHeader_Date from "#/src/client/component/feature/header/local/date"
import ELHeader_Lang from "#/src/client/component/feature/header/local/lang"
import ELHeader_Session from "#/src/client/component/feature/header/local/session"
import { urlmap } from "#/src/client/urlmap"
import st from "#client/component/feature/header/style/view.module.scss"
import logo from "#src/assets/img/app/icon.png?url"
import * as r from "react"
import * as rbs from "react-bootstrap"
import * as rr from "react-router"

export type EFHeader__View_Props = {

}

export const EFHeader_View: r.FC<EFHeader__View_Props> = props => {
    return <rbs.Navbar className={st.root}>
        <rbs.Container className={`d-flex justify-content-between ${st.container}`}>
            <rr.Link className={st.logo} to={urlmap.cn_product()} viewTransition>
                <img src={logo} width={"44rem"} height={"44rem"} />

                <span className={st.logo__text}>
                    INVENTORY
                </span>
            </rr.Link>

            <div className={st.info}>
                <ELHeader_Lang />

                <ELHeader_Session />

                <ELHeader_Date />
            </div>
        </rbs.Container>
    </rbs.Navbar>
}

export default EFHeader_View
