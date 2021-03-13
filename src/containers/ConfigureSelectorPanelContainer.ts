import { connect } from "react-redux";
import { ConfigureSelectorPanel, ConfigureSelectorPanelProps } from "../components/ConfigureSelectorPanel";
import { AppDispatch } from "../configure";
import * as ThemeMessage from '../api/Themes'
import { send } from '@giantmachines/redux-websocket';

const mapDispatchToProps = (dispatch: AppDispatch): Pick<ConfigureSelectorPanelProps,
  "newTheme" | "deleteTheme"> => {
    return {
      deleteTheme: (id: string): void => {
        const action: ThemeMessage.Delete = {
          type: ThemeMessage.MessageType.Delete,
          id,
        }
        dispatch(send(action))
      },
      newTheme: (themeId: string, name: string): void => {
        const create: ThemeMessage.Create = {
          type: ThemeMessage.MessageType.Create,
          id: themeId,
          theme: {
            id: themeId,
            name,
            less: "",
            css: "",
            parent: undefined
          }
        }
        dispatch(send(create))
      },
    }
}

export const ConfigureSelectorPanelContainer =
  connect(null, mapDispatchToProps)(ConfigureSelectorPanel)