import { urlmap } from "#/src/client/urlmap"
import st from "#client/component/feature/home/style/view.module.scss"
import * as r from "react"
import * as rr from "react-router"

export type EFHome__View_Props = {

}

export const EFHome_View: r.FC<EFHome__View_Props> = props => {
    return <main className={st.root}>
        <rr.Link to={urlmap.cn_product()} viewTransition>
            To Product
        </rr.Link>

        <br />

        <rr.Link to={urlmap.cn_porder()} viewTransition>
            To POrder
        </rr.Link>
    </main>
}

export default EFHome_View
