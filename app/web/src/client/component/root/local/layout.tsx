import EFHeader_View from "#/src/client/component/feature/header/element/view"
import * as r from "react"
import * as rr from "react-router"

export type ELRoot__Layout_Props = {

}

export const ELRoot_Layout: r.FC<ELRoot__Layout_Props> = props => {
    return <>
        <EFHeader_View />

        <rr.Outlet />
    </>
}

export default ELRoot_Layout
