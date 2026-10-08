import type { FileDataDef } from "#src/file/type/def"
import compress, * as compression from "browser-image-compression"

export const filedef_new_compressed = async function(filedef: FileDataDef, options: compression.Options): Promise<FileDataDef> {
    switch (filedef.kind) {
        case "uri":
            return filedef
        case "file":
            return {
                kind: "file",

                data: {
                    file: await compress(filedef.data.file, options),
                }
            }
    }
}
