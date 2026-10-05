import * as z from "zod"

export type EPInText_ValidationAlert = {
    readonly key: string
    readonly text: string
    readonly schema: z.ZodType
}
