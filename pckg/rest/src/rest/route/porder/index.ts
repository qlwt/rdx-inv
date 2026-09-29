import { restroute_porder_delete_new } from "#src/rest/route/porder/route/delete";
import { restroute_porder_mget_new } from "#src/rest/route/porder/route/mget";
import { restroute_porder_patch_new } from "#src/rest/route/porder/route/patch";
import { restroute_porder_post_new } from "#src/rest/route/porder/route/post";
import type { Cluster } from "#src/util/cluster/type/cluster";

export const restroute_porder = {
    routes: {
        delete: restroute_porder_delete_new({}),
        patch: restroute_porder_patch_new({}),
        post: restroute_porder_post_new({}),
        mget: restroute_porder_mget_new({}),
    },
} satisfies Cluster
