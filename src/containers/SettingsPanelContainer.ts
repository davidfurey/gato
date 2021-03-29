import { SettingsPanel, SettingsPanelProps } from '../components/SettingsPanel'
import { ControlAppState } from '../reducers/controlapp'
import { connect } from 'react-redux'
import { AppDispatch } from '../control'
import * as Event from '../api/Events'
import { send } from '@giantmachines/redux-websocket';
import { selectNonTemplates } from '../selectors'

const mapStateToProps = (state: ControlAppState):
  Pick<SettingsPanelProps, "events" | "event"> => {
  return {
    events: selectNonTemplates(state.shared),
    event: state.shared.events[state.shared.eventId],
  }
}

const mapDispatchToProps = (dispatch: AppDispatch):
  Pick<SettingsPanelProps, "setEvent"> => {
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