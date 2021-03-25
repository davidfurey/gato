import { connect } from "react-redux";
import { ThemeEditPane, ThemeEditPaneProps } from "../components/editpanes/ThemeEditPane";
import { AppDispatch } from "../configure";
import * as ThemeMessage from '../api/Themes'
import { Theme } from "../reducers/shared";
import { send } from '@giantmachines/redux-websocket';

const mapDispatchToProps = (dispatch: AppDispatch): Pick<ThemeEditPaneProps,
  "update"> => {
    return {
      update: (id: string, theme: Partial<Theme>): void => {
        const action: ThemeMessage.Update = {
          type: ThemeMessage.MessageType.Update,
          theme,
          id
        }
        dispatch(send(action))
      }
    }
}

export const ThemeEditPaneContainer = connect(null, mapDispatchToProps)(ThemeEditPane)