import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type RemKey = keyof typeof rapi
export type RemNode<Key extends RemKey> = rest.DatabaseOut[Key]
