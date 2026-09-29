import type { FnValidator } from "#src/fn/type/commons";
import type { Maybe } from "#src/maybe/type/maybe";

export const promise_raceto = function <R, T extends R>(src: Promise<R>[], predicate: FnValidator<R, T>): Promise<Maybe<T>> {
    return new Promise(async resolve => {
        if (src.length === 0) {
            resolve({ kind: false })
        }

        let i = src.length
        let finished = false

        for (const promise of src) {
            promise.then(promise_result => {
                if (finished) { return }

                i -= 1

                if (predicate(promise_result)) {
                    if (i === 0) {
                        finished = true

                        resolve({ kind: true, value: promise_result, })

                        return
                    }
                } else {
                    resolve({ kind: false, })

                    return
                }
            })
        }
    })
}
