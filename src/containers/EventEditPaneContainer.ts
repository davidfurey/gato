import { connect } from "react-redux";
import { EventEditPane, EventEditPaneProps } from "../components/editpanes/EventEditPane";
import { AppDispatch } from "../manage";
import * as EventMessage from '../api/Events'
import * as ComponentMessage from '../api/Components'
import { send } from '@giantmachines/redux-websocket';
import { OSDLiveEvent } from "../reducers/shared";

const mapDispatchToProps = (dispatch: AppDispatch): Pick<EventEditPaneProps, 
  "removeComponent" | "addComponent" | "newComponent" | "updateEvent"> => {
    return {
      removeComponent: (eventId: string, componentId: string): void => {
        const action: EventMessage.RemoveComponent = {
          type: EventMessage.MessageType.RemoveComponent,
          id: eventId,
          componentId
        }
        dispatch(send(action))
      },
      addComponent: (eventId: string, componentId: string): void => {
        const action: EventMessage.AddComponent = {
          type: EventMessage.MessageType.AddComponent,
          id: eventId,
          componentId
        }
        dispatch(send(action))
      },
      newComponent: (componentId: string, name: string, type: string): void => {
        const create: ComponentMessage.Create = {
          type: ComponentMessage.MessageType.Create,
          id: componentId,
          component: {
            id: componentId,
            name,
            type,
            shared: false,
          }
        }
        dispatch(send(create))
      },
      updateEvent: (event: OSDLiveEvent): void => {
        const action: EventMessage.Update = {
          type: EventMessage.MessageType.Update,
          name: event.name,
          id: event.id
        }
        dispatch(send(action))
      },
    }
}

export const EventEditPaneContainer = connect(null, mapDispatchToProps)(EventEditPane)