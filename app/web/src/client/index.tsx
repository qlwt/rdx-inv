import "#client/style/index.scss";
import "bootstrap/dist/css/bootstrap.min.css"
import "@qyu/reactcmp-dropdown/style/index.css"

import ER_App from "#client/component/root/element/app";
import { cst_root_app, cst_root_dropdown, cst_root_modal } from "#client/const/roots";
import * as r from "react";
import * as rdom from "react-dom/client";
import * as rtkr from "react-redux";
import * as rr from "react-router";
import * as gs from "@ta/gstate"

document.body.appendChild(cst_root_app)
document.body.appendChild(cst_root_modal)
document.body.appendChild(cst_root_dropdown)

rdom.createRoot(cst_root_app).render(
    <r.StrictMode>
        <rtkr.Provider store={gs.store}>
            <rr.BrowserRouter>
                <ER_App />
            </rr.BrowserRouter>
        </rtkr.Provider>
    </r.StrictMode>
)
