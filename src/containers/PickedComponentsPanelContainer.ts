import { connect } from 'react-redux'
import { PickedComponentsPanel, PickedComponentsPanelProps } from '../components/PickedComponentsPanel'
import * as Transistion from '../api/Transitions'
import { send } from '@giantmachines/redux-websocket';
import * as List from '../api/Lists';
import { AppDispatch } from '../control';
import { ControlAppState } from '../reducers/controlapp';
import { OSDComponent } from '../OSDComponent';

interface PickedComponentsPanelContainerProps {
  eventId: string;
}

const mapDispatchToProps = (
  dispatch: AppDispatch,
  ownProps: PickedComponentsPanelContainerProps):
  Pick<PickedComponentsPanelProps, "show" | "hide" | "setComponent"> => {
  return {
    show: (id: string, displayId: string): void => {
      const action: Transistion.GoTransistion = {
        displayId,
        type: Transistion.MessageType.Go,
        inComponentId: id,
        transition: "default",
        transistionDuration: 500,
      }
      dispatch(send(action))
    },
    hide: (id: string, displayId: string): void => {
      const action: Transistion.GoTransistion = {
        displayId,
        type: Transistion.MessageType.Go,
        outComponentId: id,
        transition: "default",
        transistionDuration: 500,
      }
      dispatch(send(action))
    },
    setComponent: (index: number, id: string): void => {
      const action: List.ReplaceItem = {
        type: List.MessageType.ReplaceItem,
        eventId: ownProps.eventId,
        name: "quick",
        componentId: id,
        position: index
      }
      dispatch(send(action))
    }
  }
}

const mapStateToProps =
  (state: ControlAppState): Pick<PickedComponentsPanelProps, "pickedComponents" | "components" | "displays"> => {

  const liveEvent = state.shared.events[state.shared.eventId]

  const lookupComponentById = (id: string): OSDComponent[] => {
    const component = state.shared.components[id]
    return component ? [component] : []
  }

  return {
    pickedComponents: liveEvent ? liveEvent.lists.find((l) => l.listType === "picked")?.components || [] : [],
    components: liveEvent ? liveEvent.components.flatMap(lookupComponentById) : [],
    displays: state.shared.displays
  }
}

const PickedComponentsPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PickedComponentsPanel)

export default PickedComponentsPanelContainer