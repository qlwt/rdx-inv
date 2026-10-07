export type GLReport_Message = {
    readonly kind: "info" | "error" | "success"
    readonly text: string
}

export type GLReport_State = {
    readonly msg_list: GLReport_Message[]
}
