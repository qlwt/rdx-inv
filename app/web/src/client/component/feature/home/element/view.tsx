import EPVirtual_GMonDyn from "#/src/client/component/primitive/virtual/element/gmondyn"
import { urlmap } from "#/src/client/urlmap"
import st from "#client/component/feature/home/style/view.module.scss"
import * as r from "react"
import * as rr from "react-router"

export type EFHome__View_Props = {

}

export const EFHome_View: r.FC<EFHome__View_Props> = props => {
    return <main className={st.root}>
        <rr.Link to={urlmap.cn_product()}>
            To Product
        </rr.Link>

        <br />

        <rr.Link to={urlmap.cn_porder()}>
            To POrder
        </rr.Link>

        {/* <EPVirtual_GMonDyn */}
        {/*     window_buffer={0} */}
        {/**/}
        {/*     src_length={100} */}
        {/*     src_render={(index, refi) => { */}
        {/*         return <div key={index} ref={refi} style={{ background: "blue", }}> */}
        {/*             Value: {index} */}
        {/*         </div> */}
        {/*     }} */}
        {/**/}
        {/*     grid_render={props => { */}
        {/*         return <div */}
        {/*             {...props} */}
        {/*             style={{ */}
        {/*                 ...props.style, */}
        {/**/}
        {/*                 display: "grid", */}
        {/*                 padding: "60px", */}
        {/*                 gap: "30px", */}
        {/*                 gridAutoRows: "120px", */}
        {/*                 gridTemplateColumns: "1fr", */}
        {/*             }} */}
        {/*         /> */}
        {/*     }} */}
        {/* /> */}
    </main>
}

export default EFHome_View
