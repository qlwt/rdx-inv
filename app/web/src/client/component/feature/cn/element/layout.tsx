import ELCN_SideNav from "#/src/client/component/feature/cn/local/sidenav"
import st from "#client/component/feature/cn/style/layout.module.scss"
import * as r from "react"
import * as rr from "react-router"

export type EFCN__Layout_Props = {

}

export const EFCN_Layout: r.FC<EFCN__Layout_Props> = props => {
    return <div className={st.root}>
        <ELCN_SideNav />

        <rr.Outlet />
    </div>
}

export default EFCN_Layout
