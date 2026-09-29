import * as z from "zod"

export const zod_isnt = function <Sch extends z.ZodType, V>(schema: Sch, value: V): value is Exclude<V, z.infer<Sch>> {
    return !schema.safeParse(value).success
}
