import { imgurl_new_wrapper, type ImgUrl_New_Src } from "#/src/client/util/imgurl/new_wrapper";
import { imgurl_attr_new_placeholder } from "#/src/client/util/imgurl/attr_new_placeholder";
import type { ImgUrl_Attr } from "#/src/client/util/imgurl/type/attr";
import type { ImgUrl_TName } from "#/src/client/util/imgurl/type/tname";

export const imgurl_attr_new_wrapper = function (tname: ImgUrl_TName, src: ImgUrl_New_Src | null): ImgUrl_Attr {
    const remote = imgurl_new_wrapper(tname, src)

    if (remote.payload) {
        return remote.payload.attr
    }

    return imgurl_attr_new_placeholder(tname)
}
