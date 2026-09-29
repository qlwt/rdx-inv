import { restroute_product_delete_new } from "#src/rest/route/product/route/delete";
import type { Cluster } from "#src/util/cluster/type/cluster";

export const restroute_product = {
    routes: {
        delete: restroute_product_delete_new({}),
    },
} satisfies Cluster
