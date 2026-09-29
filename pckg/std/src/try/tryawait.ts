export const tryawait = function <T>(src: Promise<T> | T): Promise<T> {
    if (src instanceof Promise) {
        return src
    }

    return Promise.resolve(src)
}
