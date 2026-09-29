import * as z from "zod"

export const zod_is = function <Sch extends z.ZodType>(schema: Sch, value: any): value is z.infer<Sch> {
    return schema.safeParse(value).success
}
