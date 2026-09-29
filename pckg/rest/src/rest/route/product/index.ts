import { restroute_product_delete_new } from "#src/rest/route/product/route/delete";
import { restroute_product_mget_new } from "#src/rest/route/product/route/mget";
import { restroute_product_patch_new } from "#src/rest/route/product/route/patch";
import { restroute_product_post_new } from "#src/rest/route/product/route/post";
import type { Cluster } from "#src/util/cluster/type/cluster";

export const restroute_product = {
    routes: {
        delete: restroute_product_delete_new({}),
        patch: restroute_product_patch_new({}),
        post: restroute_product_post_new({}),
        mget: restroute_product_mget_new({}),
    },
} satisfies Cluster
