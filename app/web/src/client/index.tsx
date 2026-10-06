import "#client/style/index.scss";
import "@qyu/reactcmp-dropdown/style/index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import EFCN_Layout from "#/src/client/component/feature/cn/element/layout";
import EFCN_PagePOrder from "#/src/client/component/feature/cn/element/page_porder";
import EFCN_PageProduct from "#/src/client/component/feature/cn/element/page_product";
import ER_App from "#/src/client/component/root/element/app";
import { urlmap } from "#/src/client/urlmap";
import { cst_root_app, cst_root_dropdown, cst_root_modal } from "#client/const/roots";
import * as gs from "@ta/gstate";
import * as r from "react";
import * as rdom from "react-dom/client";
import * as rtkr from "react-redux";
import * as rr from "react-router";

document.body.appendChild(cst_root_app)
document.body.appendChild(cst_root_modal)
document.body.appendChild(cst_root_dropdown)

const router = rr.createBrowserRouter([{
    Component: ER_App,

    children: [
        // {
        //     path: urlmap.home(),
        //     Component: EFHome_View,
        // },

        {
            Component: EFCN_Layout,

            children: [
                {
                    path: urlmap.cn_porder(),
                    Component: EFCN_PagePOrder,
                },
                {
                    path: urlmap.cn_product(),
                    Component: EFCN_PageProduct,
                },
            ],
        }
    ],
}])

rdom.createRoot(cst_root_app).render(
    <r.StrictMode>
        <rtkr.Provider store={gs.store}>
            <rr.RouterProvider router={router} />
                {/* <ER_App /> */}
            {/* </rr.RouterProvider> */}
        </rtkr.Provider>
    </r.StrictMode>
)
