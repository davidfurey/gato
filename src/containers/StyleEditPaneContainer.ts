import { connect } from "react-redux";
import { StyleEditPane, StyleEditPaneProps } from "../components/editpanes/StyleEditPane";
import { AppDispatch } from "../configure";
import * as StyleMessage from '../api/Styles'
import { Style } from "../reducers/shared";
import { send } from '@giantmachines/redux-websocket';

const mapDispatchToProps = (dispatch: AppDispatch): Pick<StyleEditPaneProps,
  "update"> => {
    return {
      update: (id: string, style: Partial<Style>): void => {
        const action: StyleMessage.Update = {
          type: StyleMessage.MessageType.Update,
          style,
          id: id
        }
        dispatch(send(action))
      }
    }
}

export const StyleEditPaneContainer = connect(null, mapDispatchToProps)(StyleEditPane)