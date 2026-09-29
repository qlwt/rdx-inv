import "#client/style/index.scss";

import ER_App from "#client/component/root/element/app";
import { cst_root_app, cst_root_dropdown, cst_root_modal } from "#client/const/roots";
import * as r from "react";
import * as rdom from "react-dom/client";
import * as rr from "react-router";

document.body.appendChild(cst_root_app)
document.body.appendChild(cst_root_modal)
document.body.appendChild(cst_root_dropdown)

rdom.createRoot(cst_root_app).render(
    <r.StrictMode>
        <rr.BrowserRouter>
            <ER_App />
        </rr.BrowserRouter>
    </r.StrictMode>
)
