import { connect } from 'react-redux'
import { PickedComponentsPanel, PickedComponentsPanelProps } from '../components/PickedComponentsPanel'
import * as Transistion from '../api/Transitions'
import { send } from '@giantmachines/redux-websocket';
import { AppDispatch } from '../control';
import { ControlAppState } from '../reducers/controlapp';
import { OSDComponent } from '../OSDComponent';

// todo: Live should be a cross for this panel
const mapDispatchToProps = (dispatch: AppDispatch):
  Pick<PickedComponentsPanelProps, "show" | "hide"> => {
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
    }
  }
}

const mapStateToProps =
  (state: ControlAppState): Pick<PickedComponentsPanelProps, "pickedComponents" | "components" | "displays"> => {

  const lookupComponentById = (id: string): OSDComponent[] => {
    const component = state.shared.components[id]
    return component ? [component] : []
  }

  const onAirDisplays = state.shared.displays.filter((d) => d.type === "OnAir")

  const visibleComponents = onAirDisplays.flatMap((d) =>
    d.onScreenComponents.filter((c) => c.state === "entering" || c.state === "visible").map((c) => c.id)
  )

  return {
    pickedComponents: visibleComponents,
    components: visibleComponents.flatMap(lookupComponentById),
    displays: onAirDisplays
  }
}

const LiveComponentsPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps)(PickedComponentsPanel)

export default LiveComponentsPanelContainer