import { connect } from "react-redux";
import { ConfigureSelectorPanel, ConfigureSelectorPanelProps } from "../components/ConfigureSelectorPanel";
import { AppDispatch } from "../configure";
import * as ThemeMessage from '../api/Themes'
import * as StyleMessage from '../api/Styles'
import { send } from '@giantmachines/redux-websocket';
import * as EditPanelActions from '../actions/editpanel'
import { EditPane } from "../types/editpane";
import { ComponentType } from "../reducers/shared";

const mapDispatchToProps = (dispatch: AppDispatch): Pick<ConfigureSelectorPanelProps,
  "newTheme" | "deleteTheme" | "newStyle" | "deleteStyle" | "openTab"> => {
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
            parent: null
          }
        }
        dispatch(send(create))
      },
      deleteStyle: (id: string): void => {
        const action: StyleMessage.Delete = {
          type: StyleMessage.MessageType.Delete,
          id,
        }
        dispatch(send(action))
      },
      newStyle: (styleId: string, name: string, componentType: ComponentType): void => {
        const create: StyleMessage.Create = {
          type: StyleMessage.MessageType.Create,
          id: styleId,
          style: {
            id: styleId,
            name: name,
            parent: null,
            less: "",
            componentType
          }
        }
        dispatch(send(create))
      },
      openTab: (pane: EditPane): void => {
        const action: EditPanelActions.Open = {
          type: EditPanelActions.ActionType.Open,
          pane,
        }
        dispatch(action)
      },
    }
}

export const ConfigureSelectorPanelContainer =
  connect(null, mapDispatchToProps)(ConfigureSelectorPanel)