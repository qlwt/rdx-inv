import EFCN_Layout from "#/src/client/component/feature/cn/element/layout"
import EFCN_PagePOrder from "#/src/client/component/feature/cn/element/page_porder"
import EFCN_PageProduct from "#/src/client/component/feature/cn/element/page_product"
import EFHome_View from "#/src/client/component/feature/home/element/view"
import ELRoot_Layout from "#/src/client/component/root/local/layout"
import { urlmap } from "#/src/client/urlmap"
import * as r from "react"
import * as rr from "react-router"

export type ER__App_Props = {

}

export const ER_App: r.FC<ER__App_Props> = props => {
    return <>
        <rr.Routes>
            <rr.Route element={<ELRoot_Layout />}>
                <rr.Route path={urlmap.home()} element={<EFHome_View />} />

                <rr.Route element={<EFCN_Layout />}>
                    <rr.Route path={urlmap.cn_product()} element={<EFCN_PageProduct />} />
                    <rr.Route path={urlmap.cn_porder()} element={<EFCN_PagePOrder />} />
                </rr.Route>
            </rr.Route>
        </rr.Routes>
    </>
}

export default ER_App
