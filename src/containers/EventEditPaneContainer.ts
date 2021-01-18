import { connect } from "react-redux";
import { EventEditPane, EventEditPaneProps } from "../components/editpanes/EventEditPane";
import { AppDispatch } from "../manage";
import * as EventMessage from '../api/Events'
import * as ComponentMessage from '../api/Components'
import * as ListMessage from '../api/Lists'
import { send } from '@giantmachines/redux-websocket';
import { OSDLiveEvent } from "../reducers/shared";

const mapDispatchToProps = (dispatch: AppDispatch): Pick<EventEditPaneProps,
  "removeComponent" |
  "addComponent" |
  "newComponent" |
  "updateEvent" |
  "swapComponent" |
  "setComponent" |
  "removeListComponent" |
  "addListComponent"> => {
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
      updateEvent: (id: string, event: Partial<OSDLiveEvent>): void => {
        const action: EventMessage.Update = {
          type: EventMessage.MessageType.Update,
          event,
          id,
        }
        dispatch(send(action))
      },
      swapComponent: (
        eventId: string,
        listName: string,
        componentId: string,
        sourcePosition: number,
        destinationPosition: number
      ): void => {
        const action: ListMessage.SwapItems = {
          type: ListMessage.MessageType.SwapItems,
          eventId,
          name: listName,
          sourcePosition,
          destinationPosition,
          sourceComponent: componentId,
        }
        dispatch(send(action))
      },
      setComponent: (eventId: string, listName: string, index: number, id: string): void => {
        const action: ListMessage.ReplaceItem = {
          type: ListMessage.MessageType.ReplaceItem,
          eventId,
          name: listName,
          componentId: id,
          position: index
        }
        dispatch(send(action))
      },
      removeListComponent: (
        eventId: string,
        listName: string,
        index: number,
        componentId: string
      ): void => {
        const action: ListMessage.RemoveComponent = {
          type: ListMessage.MessageType.RemoveComponent,
          eventId,
          name: listName,
          componentId,
          position: index,
        }
        dispatch(send(action))
      },
      addListComponent: (
        eventId: string,
        listName: string,
        index: number,
        componentId: string | null
      ): void => {
        const action: ListMessage.AddComponent = {
          type: ListMessage.MessageType.AddComponent,
          eventId,
          name: listName,
          componentId,
          position: index,
        }
        dispatch(send(action))
      },
    }
}

export const EventEditPaneContainer = connect(null, mapDispatchToProps)(EventEditPane)