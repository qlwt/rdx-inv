import EFCN_Layout from "#/src/client/component/feature/cn/element/layout";
import EPPending_Screen from "#/src/client/component/primitive/pending/element/screen";
import ER_App from "#/src/client/component/root/element/app";
import { urlmap } from "#/src/client/urlmap";
import * as rr from "react-router";

export const routes_new = function(): rr.RouteObject[] {
    return [{
        Component: ER_App,

        children: [
            {
                Component: EFCN_Layout,

                children: [
                    {
                        path: urlmap.cn_product(),
                        HydrateFallback: EPPending_Screen,

                        lazy: async () => {
                            return {
                                Component: (await import(
                                    "#/src/client/component/feature/cn/element/page_product"
                                )).EFCN_PageProduct,
                            }
                        },
                    },
                    {
                        path: urlmap.cn_porder(),
                        HydrateFallback: EPPending_Screen,

                        lazy: async () => {
                            return {
                                Component: (await import(
                                    "#/src/client/component/feature/cn/element/page_porder"
                                )).EFCN_PagePOrder,
                            }
                        },
                    },
                    {
                        path: urlmap.cn_pgroup(),
                        HydrateFallback: EPPending_Screen,

                        lazy: async () => {
                            return {
                                Component: (await import(
                                    "#/src/client/component/feature/cn/element/page_pgroup"
                                )).EFCN_PagePGroup,
                            }
                        },
                    },
                ],
            }
        ],
    }]
}
