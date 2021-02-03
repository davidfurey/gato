import { connect } from "react-redux";
import { EventEditPane, EventEditPaneProps } from "../components/editpanes/EventEditPane";
import { AppDispatch } from "../manage";
import * as EventMessage from '../api/Events'
import * as ComponentMessage from '../api/Components'
import * as ListMessage from '../api/Lists'
import { send } from '@giantmachines/redux-websocket';
import { OSDLiveEvent } from "../reducers/shared";

const mapDispatchToProps = (
  dispatch: AppDispatch,
  ownProps: Pick<EventEditPaneProps, "event">): Pick<EventEditPaneProps,
  "removeComponent" |
  "addComponent" |
  "newComponent" |
  "updateEvent" |
  "moveComponent" |
  "moveListComponent" |
  "setComponent" |
  "removeListComponent" |
  "addListComponent" |
  "upsertParameter" |
  "removeParameter"> => {
    return {
      removeComponent: (componentId: string): void => {
        const action: EventMessage.RemoveComponent = {
          type: EventMessage.MessageType.RemoveComponent,
          id: ownProps.event.id,
          componentId
        }
        dispatch(send(action))
      },
      addComponent: (componentId: string): void => {
        const action: EventMessage.AddComponent = {
          type: EventMessage.MessageType.AddComponent,
          id: ownProps.event.id,
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
      updateEvent: (event: Partial<OSDLiveEvent>): void => {
        const action: EventMessage.Update = {
          type: EventMessage.MessageType.Update,
          event,
          id: ownProps.event.id,
        }
        dispatch(send(action))
      },
      moveListComponent: (
        listName: string,
        componentId: string | null,
        sourcePosition: number,
        destinationPosition: number
      ): void => {
        const action: ListMessage.MoveComponent = {
          type: ListMessage.MessageType.MoveComponent,
          eventId: ownProps.event.id,
          name: listName,
          componentId,
          sourcePosition,
          destinationPosition,
        }
        dispatch(send(action))
      },
      moveComponent: (
        componentId: string,
        sourcePosition: number,
        destinationPosition: number
      ): void => {
        const action: EventMessage.MoveComponent = {
          type: EventMessage.MessageType.MoveComponent,
          id: ownProps.event.id,
          componentId,
          sourcePosition,
          destinationPosition,
        }
        dispatch(send(action))
      },
      setComponent: (listName: string, index: number, id: string): void => {
        const action: ListMessage.ReplaceItem = {
          type: ListMessage.MessageType.ReplaceItem,
          eventId: ownProps.event.id,
          name: listName,
          componentId: id,
          position: index
        }
        dispatch(send(action))
      },
      removeListComponent: (
        listName: string,
        index: number,
        componentId: string | null
      ): void => {
        const action: ListMessage.RemoveComponent = {
          type: ListMessage.MessageType.RemoveComponent,
          eventId: ownProps.event.id,
          name: listName,
          componentId,
          position: index,
        }
        dispatch(send(action))
      },
      addListComponent: (
        listName: string,
        index: number,
        componentId: string | null
      ): void => {
        const action: ListMessage.AddComponent = {
          type: ListMessage.MessageType.AddComponent,
          eventId: ownProps.event.id,
          name: listName,
          componentId,
          position: index,
        }
        dispatch(send(action))
      },
      upsertParameter: (name: string, value: string) => {
        const action: EventMessage.UpsertParameter = {
          type: EventMessage.MessageType.UpsertParameter,
          id: ownProps.event.id,
          name,
          value,
        }
        dispatch(send(action))
      },
      removeParameter: (name: string) => {
        const action: EventMessage.RemoveParameter = {
          type: EventMessage.MessageType.RemoveParameter,
          id: ownProps.event.id,
          name,
        }
        dispatch(send(action))
      }
    }
}

export const EventEditPaneContainer = connect(null, mapDispatchToProps)(EventEditPane)