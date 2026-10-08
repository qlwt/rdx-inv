import { restx_img_route_get_new } from "#src/restx/img/route/get";
import { restx_img_route_post_new } from "#src/restx/img/route/post";

export const restx_img = {
    routes: {
        get: restx_img_route_get_new({}),
        post: restx_img_route_post_new({}),
    },
}
