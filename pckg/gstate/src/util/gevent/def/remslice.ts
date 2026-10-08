import { GEvent_Kind, type GEvent_ARemSlice } from "#src/util/gevent/type/gevent"
import * as rtk from "@reduxjs/toolkit"

export const gevent_def_remslice = rtk.createAction<GEvent_ARemSlice>(GEvent_Kind.RemSlice)
