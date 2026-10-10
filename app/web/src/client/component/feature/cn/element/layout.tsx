import ELCN_SideNav from "#/src/client/component/feature/cn/local/sidenav"
import st from "#client/component/feature/cn/style/layout.module.scss"
import * as r from "react"
import * as rr from "react-router"
import * as rfc from "@qyu/reactcmp-flow-control"
import EPPending_Screen from "#/src/client/component/primitive/pending/element/screen"

export type EFCN__Layout_Props = {

}

export const EFCN_Layout: r.FC<EFCN__Layout_Props> = props => {
    const navigation = rr.useNavigation()

    return <div className={st.root}>
        <ELCN_SideNav />

        <main className={st.main}>
            <rfc.CmpIf value={navigation.state === "loading"}>
                <EPPending_Screen />
            </rfc.CmpIf>

            <rr.Outlet />
        </main>
    </div>
}

export default EFCN_Layout
