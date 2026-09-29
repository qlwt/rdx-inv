import type { FnPredicate } from "#src/fn/type/commons";

export const promise_every = function <R>(src: Promise<R>[], predicate: FnPredicate<R>): Promise<boolean> {
    return new Promise(async resolve => {
        if (src.length === 0) {
            resolve(false)
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

                        resolve(true)

                        return
                    }
                } else {
                    resolve(false)

                    return
                }
            })
        }
    })
}
