import ELCN_Grid from "#/src/client/component/feature/cn/local/grid"
import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_PGroupCardView from "#/src/client/component/feature/cn/local/pgroup/card/view"
import * as capi from "@ta/capi"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as rbs from "react-bootstrap"

const pick = {} satisfies capi.SendMGet_Query<"pgroup">["pick"]

export type EFCN_PagePGroup_Props = {

}

export const EFCN_PagePGroup: r.FC<EFCN_PagePGroup_Props> = props => {
    const dispatch = gs.useDispatch()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    return <>
        <ELCN_Head
            pick={pick}
            target={"pgroup"}
            title={`Product Group`}

            ev_post={() => {
                dispatch(rem.pgroup.act.post({
                    body: {
                        img_id: null,
                        title: "New Group",
                    },
                }))
            }}
        />

        <ELCN_Grid
            pick={pick}
            kind={`pgroup`}
            target={"pgroup"}
            placeholder={`No Products Added`}

            render_child={(remnode, refi) => {
                return <ELCN_PGroupCardView
                    key={remnode.id}

                    ref={refi}
                    remnode={remnode}
                    deletion_set={deletion_set}
                />
            }}
        />

        <rbs.Modal show={deletion.kind} onHide={() => deletion_set(std.MNONE)}>
            <rbs.Modal.Header>
                Do you really want to delete that item?
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

                        dispatch(rem.pgroup.act.delete({
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
    </>
}

export default EFCN_PagePGroup
