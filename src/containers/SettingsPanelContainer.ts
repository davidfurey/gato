import { SettingsPanel } from '../components/SettingsPanel'
import { ControlAppState } from '../reducers/controlapp'
import { connect } from 'react-redux'
import { AppDispatch } from '../control'
import * as Event from '../api/Events'
import { send } from '@giantmachines/redux-websocket';

const mapStateToProps = (state: ControlAppState) => {
  return {
    events: Object.values(state.shared.events),
    event: state.shared.events[state.shared.eventId],
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setEvent: (eventId: string): void => {
      const action: Event.Load = {
        type: Event.MessageType.Load,
        id: eventId,
      }
      dispatch(send(action))
    }
  }
}

export const SettingsPanelContainer = connect(mapStateToProps, mapDispatchToProps)(SettingsPanel)