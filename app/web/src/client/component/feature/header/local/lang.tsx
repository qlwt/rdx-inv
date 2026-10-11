import { i18n_resources } from "#/src/client/i18n/init"
import st from "#/src/client/component/feature/header/style/lang.module.scss"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as r from "react"
import * as ri18 from "react-i18next"

const language_list = Object.keys(i18n_resources)

export type ELHeader__Lang_Props = {

}

export const ELHeader_Lang: r.FC<ELHeader__Lang_Props> = props => {
    const { i18n } = ri18.useTranslation()
    const [open, open_set] = r.useState(false)

    return <rddn.CmpContainerVirtual open={open} open_set={open_set}>
        <rddn.CmpButton className={st.btn}>
            {i18n.language}
        </rddn.CmpButton>

        <rddn.CmpListPortal
            portal={`dropdown-root`}
            gap={2}
            stretch
            align={"center"}
            rearrange={{ deps: [i18n.language], }}

            className={st.listc}
        >
            <rddn.CmpContent className={st.list}>
                <rfc.CmpLoop data={language_list}>
                    {language => {
                        return <button
                            key={language}

                            className={st.item}
                            disabled={i18n.language === language}
                            onClick={() => { i18n.changeLanguage(language) }}
                        >
                            {language}
                        </button>
                    }}
                </rfc.CmpLoop>
            </rddn.CmpContent>
        </rddn.CmpListPortal>
    </rddn.CmpContainerVirtual>
}

export default ELHeader_Lang
