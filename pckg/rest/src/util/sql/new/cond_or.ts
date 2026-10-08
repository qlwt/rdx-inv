import * as ksly from "kysely"

export const sql_new_cond_or = function(src: (ksly.RawBuilder<unknown> | null)[]): ksly.RawBuilder<unknown> {
    const reduced = src.reduce<null | ksly.RawBuilder<unknown>>(
        (acc, filter) => {
            if (filter === null) {
                return acc
            }

            if (acc === null) {
                return ksly.sql`(${filter})`
            }

            return ksly.sql`${acc} or (${filter})`
        },
        null
    )

    if (reduced) {
        return ksly.sql`(${reduced})`
    }

    return ksly.sql`true`
}
