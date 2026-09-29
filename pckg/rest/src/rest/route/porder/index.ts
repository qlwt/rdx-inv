import { restroute_porder_delete_new } from "#src/rest/route/porder/route/delete";
import type { Cluster } from "#src/util/cluster/type/cluster";

export const restroute_porder = {
    routes: {
        delete: restroute_porder_delete_new({}),
    },
} satisfies Cluster
