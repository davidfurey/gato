import { connect } from 'react-redux'
import { PickedComponentsPanel, PickedComponentsPanelProps } from '../components/PickedComponentsPanel'
import * as Transistion from '../api/Transitions'
import { send } from '@giantmachines/redux-websocket';
import { AppDispatch } from '../control';

interface LiveComponentsPanelContainerProps {
  eventId: string;
}

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

const LiveComponentsPanelContainer = connect(null, mapDispatchToProps)(PickedComponentsPanel)

export default LiveComponentsPanelContainer