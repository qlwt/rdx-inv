import { asset_pgroup_placeholder } from "#/src/client/const/assets"
import type { ImgUrl_Attr } from "#/src/client/util/imgurl/type/attr"
import type { ImgUrl_TName } from "#/src/client/util/imgurl/type/tname"

export const imgurl_attr_new_placeholder = function(tname: ImgUrl_TName): ImgUrl_Attr {
    switch (tname) {
        case "pgroup":
            return {
                src: asset_pgroup_placeholder,
            }
    }
}
