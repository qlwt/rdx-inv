import ELCN_Grid from "#/src/client/component/feature/cn/local/grid"
import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_PGroupCardView from "#/src/client/component/feature/cn/local/pgroup/card/view"
import * as capi from "@ta/capi"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as rbs from "react-bootstrap"
import * as ri18 from "react-i18next"

const pick = {} satisfies capi.SendMGet_Query<"pgroup">["pick"]

export type EFCN_PagePGroup_Props = {

}

export const EFCN_PagePGroup: r.FC<EFCN_PagePGroup_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = gs.useDispatch()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    return <>
        <ELCN_Head
            pick={pick}
            target={"pgroup"}
            title={t(`cn.head.pgroup`)}

            ev_post={() => {
                dispatch(rem.pgroup.act.post({
                    body: {
                        img_id: null,
                        title: "",
                    },
                }))
            }}
        />

        <ELCN_Grid
            pick={pick}
            kind={`pgroup`}
            target={"pgroup"}
            placeholder={t(`cn.grid.ph_pgroup`)}

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
                ${t(`cn.grid.modal.del_pgroup`)}
            </rbs.Modal.Header>

            <rbs.Modal.Footer>
                <rbs.Button
                    variant={`primary`}

                    onClick={() => {
                        deletion_set(std.MNONE)
                    }}
                >
                    {t(`cn.grid.modal.cancel`)}
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
                    {t(`cn.grid.modal.confirm`)}
                </rbs.Button>
            </rbs.Modal.Footer>
        </rbs.Modal>
    </>
}

export default EFCN_PagePGroup
