import { urlmap } from "#/src/client/urlmap"
import st from "#client/component/feature/cn/style/sidenav.module.scss"
import * as r from "react"
import * as rr from "react-router"
import cl from "classnames"

export type ELCN_SideNav_Props = {

}

export const ELCN_SideNav: r.FC<ELCN_SideNav_Props> = props => {
    return <aside className={st.root}>
        <nav className={st.nav}>
            <rr.NavLink className={({ isActive }) => cl(st.link, isActive && st._active)} to={urlmap.cn_product()}>
                <span className={st.link__text}>
                    PRODUCTS
                </span>
            </rr.NavLink>

            <rr.NavLink className={({ isActive }) => cl(st.link, isActive && st._active)} to={urlmap.cn_porder()}>
                <span className={st.link__text}>
                    ORDERS
                </span>
            </rr.NavLink>
        </nav>
    </aside>
}

export default ELCN_SideNav
