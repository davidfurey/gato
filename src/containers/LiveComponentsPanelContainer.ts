import { connect } from 'react-redux'
import { PickedComponentsPanel, PickedComponentsPanelProps } from '../components/PickedComponentsPanel'
import * as Transistion from '../api/Transitions'
import { send } from '@giantmachines/redux-websocket';
import { AppDispatch } from '../control';
import { ControlAppState } from '../reducers/controlapp';
import { selectOnAirDisplays, selectVisibleComponentIds, selectVisibleComponents } from '../selectors';

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

  return {
    pickedComponents: selectVisibleComponentIds(state.shared),
    components: selectVisibleComponents(state.shared),
    displays: selectOnAirDisplays(state.shared)
  }
}

const LiveComponentsPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps)(PickedComponentsPanel)

export default LiveComponentsPanelContainer