import * as rbs from "react-bootstrap"
import st from "#/src/client/component/primitive/pending/style/screen.module.scss"
import * as r from "react"

export type EPPending__Screen_Props = {
}

export const EPPending_Screen: r.FC<EPPending__Screen_Props> = function() {
    return <div className={st.root}>
        <rbs.Spinner variant={"white"} />
    </div>
}

export default EPPending_Screen
