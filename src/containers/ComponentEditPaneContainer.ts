import { connect } from "react-redux";
import { ComponentEditPane, ComponentEditPaneProps } from "../components/editpanes/ComponentEditPane";
import { AppDispatch } from "../manage";
import { send } from '@giantmachines/redux-websocket';
import * as ComponentMessage from '../api/Components'
import { OSDComponent } from "../OSDComponent";

const mapDispatchToProps = (dispatch: AppDispatch): Pick<ComponentEditPaneProps,
  "updateComponent"> => {
    return {
      updateComponent: <T extends OSDComponent>(component: T): void => {
        const action: ComponentMessage.Update = {
          type: ComponentMessage.MessageType.Update,
          component: component,
          id: component.id
        }
        dispatch(send(action))
      }
    }
}

export const ComponentEditPaneContainer = connect(null, mapDispatchToProps)(ComponentEditPane)