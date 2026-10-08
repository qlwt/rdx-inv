import { restroute_pgroup_delete_new } from "#src/rest/route/pgroup/route/delete";
import { restroute_pgroup_mget_new } from "#src/rest/route/pgroup/route/mget";
import { restroute_pgroup_patch_new } from "#src/rest/route/pgroup/route/patch";
import { restroute_pgroup_post_new } from "#src/rest/route/pgroup/route/post";
import type { Cluster } from "#src/util/cluster/type/cluster";

export const restroute_pgroup = {
    routes: {
        delete: restroute_pgroup_delete_new({}),
        patch: restroute_pgroup_patch_new({}),
        post: restroute_pgroup_post_new({}),
        mget: restroute_pgroup_mget_new({}),
    },
} satisfies Cluster
