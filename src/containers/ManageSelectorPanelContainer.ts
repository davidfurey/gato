import { connect } from "react-redux";
import { ManageSelectorPanel, ManageSelectorPanelProps } from "../components/ManageSelectorPanel";
import { AppDispatch } from "../manage";
import * as EditPanelActions from '../actions/editpanel'
import { EditPane } from "../types/editpane";
import * as ComponentMessage from '../api/Components'
import * as EventMessage from '../api/Events'
import { send } from '@giantmachines/redux-websocket';
import * as EventActions from '../api/Events'
import * as ComponentActions from '../api/Components'

const mapDispatchToProps = (dispatch: AppDispatch): Pick<ManageSelectorPanelProps,
  "deleteComponent" | "deleteEvent" | "openTab" | "newComponent" | "newEvent" | "copyEvent"> => {
    return {
      deleteComponent: (id: string): void => {
        const action: ComponentMessage.Delete = {
          type: ComponentMessage.MessageType.Delete,
          id,
        }
        dispatch(send(action))
      },
      deleteEvent: (id: string): void => {
        const action: EventMessage.Delete = {
          type: EventMessage.MessageType.Delete,
          id,
        }
        dispatch(send(action))
      },
      openTab: (pane: EditPane): void => {
        const action: EditPanelActions.Open = {
          type: EditPanelActions.ActionType.Open,
          pane,
        }
        dispatch(action)
      },
      newComponent: (componentId: string, name: string, type: string): void => {
        const create: ComponentMessage.Create = {
          type: ComponentMessage.MessageType.Create,
          id: componentId,
          component: {
            id: componentId,
            name,
            type,
            shared: true,
          }
        }
        dispatch(send(create))
      },
      newEvent: (eventId: string, name: string): void => {
        const create: EventMessage.Create = {
          type: EventMessage.MessageType.Create,
          id: eventId,
          name
        }
        dispatch(send(create))
      },
      copyEvent: (actions: (EventActions.Create | ComponentActions.Create)[]): void => {
        actions.forEach((action) => dispatch(send(action)))
      }
    }
}

export const ManageSelectorPanelContainer = connect(null, mapDispatchToProps)(ManageSelectorPanel)