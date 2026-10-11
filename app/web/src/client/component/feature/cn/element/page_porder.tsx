import ELCN_Head from "#/src/client/component/feature/cn/local/head"
import ELCN_POrderSplit from "#/src/client/component/feature/cn/local/porder/split"
import * as gs from "@ta/gstate"
import { rem } from "@ta/gstate"
import * as std from "@ta/std"
import * as r from "react"
import * as rbs from "react-bootstrap"
import * as ri18 from "react-i18next"

export type EFCN_PagePOrder_Props = {

}

export const EFCN_PagePOrder: r.FC<EFCN_PagePOrder_Props> = props => {
    const dispatch = gs.useDispatch()
    const { t } = ri18.useTranslation()
    const [deletion, deletion_set] = r.useState<std.Maybe<string>>(std.MNONE)

    return <>
        <ELCN_Head
            pick={{}}
            target={"porder"}
            title={t(`cn.head.porder`)}

            ev_post={() => {
                dispatch(rem.porder.act.post({
                    body: {
                        title: "",
                        description: "",

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
                {t(`cn.grid.modal.del_porder`)}
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

                        dispatch(rem.porder.act.delete({
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

export default EFCN_PagePOrder
