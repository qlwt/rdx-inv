import EFHeader_View from "#/src/client/component/feature/header/element/view"
import st from "#client/component/root/style/layout.module.scss"
import * as r from "react"
import * as rr from "react-router"

export type ELRoot__Layout_Props = {

}

export const ELRoot_Layout: r.FC<ELRoot__Layout_Props> = props => {
    return <div className={st.root}>
        <EFHeader_View />

        <rr.Outlet />
    </div>
}

export default ELRoot_Layout
