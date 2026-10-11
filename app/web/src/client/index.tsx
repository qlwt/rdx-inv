import "#client/style/index.scss";
import "@qyu/reactcmp-dropdown/style/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "#/src/client/i18n/init"

import { routes_new } from "#/src/client/routes/new";
import { cst_root_app, cst_root_dropdown } from "#client/const/roots";
import * as gs from "@ta/gstate";
import * as r from "react";
import * as rdom from "react-dom/client";
import * as rtkr from "react-redux";
import * as rr from "react-router";

document.body.appendChild(cst_root_app)
document.body.appendChild(cst_root_dropdown)

const router = rr.createBrowserRouter(routes_new())

rdom.createRoot(cst_root_app).render(
    <r.StrictMode>
        
        <rtkr.Provider store={gs.store}>
            <rr.RouterProvider router={router} />
        </rtkr.Provider>
    </r.StrictMode>
)
