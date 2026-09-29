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
            </rr.Route>
        </rr.Routes>
    </>
}

export default ER_App
