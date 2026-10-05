import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_POrderSplit from "#/src/client/component/feature/cn/local/porder/split"
import st from "#client/component/feature/cn/style/page.module.scss"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as rbs from "react-bootstrap"

export type EFCN_PagePOrder_Props = {

}

export const EFCN_PagePOrder: r.FC<EFCN_PagePOrder_Props> = props => {
    const dispatch = gs.useDispatch()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    return <main className={st.root}>
        <ELCN_Head
            pick={{}}
            target={"porder"}
            title={`Orders`}

            ev_post={() => {
                dispatch(rem.porder.act.post({
                    body: {
                        title: "New Order",
                        description: "New Description",

                        sent_at: null,
                        sent_to: null,
                    },
                }))
            }}
        />

        <ELCN_POrderSplit
            deletion_set={deletion_set}
        />

        <rbs.Modal show={deletion.kind} onHide={() => deletion_set(std.MNONE)}>
            <rbs.Modal.Header>
                Do you really want to delete that order?
            </rbs.Modal.Header>

            <rbs.Modal.Footer>
                <rbs.Button
                    variant={`primary`}

                    onClick={() => {
                        deletion_set(std.MNONE)
                    }}
                >
                    Cancel
                </rbs.Button>

                <rbs.Button
                    variant={`delete`}

                    onClick={() => {
                        if (!deletion.kind) { return }

                        dispatch(rem.porder.act.delete({
                            url: {
                                id: deletion.value,
                            },
                        }))

                        deletion_set(std.MNONE)
                    }}
                >
                    Delete
                </rbs.Button>
            </rbs.Modal.Footer>
        </rbs.Modal>
    </main>
}

export default EFCN_PagePOrder
