import { LoadEventPanel, LoadEventPanelProps } from '../components/LoadEventPanel'
import { ControlAppState } from '../reducers/controlapp'
import { connect } from 'react-redux'
import { AppDispatch } from '../control'
import * as Event from '../api/Events'
import { send } from '@giantmachines/redux-websocket';
import { selectNonTemplates } from '../selectors'

const mapStateToProps = (state: ControlAppState):
  Pick<LoadEventPanelProps, "events" | "event"> => {
  return {
    events: selectNonTemplates(state.shared),
    event: state.shared.events[state.shared.settings.eventId],
  }
}

const mapDispatchToProps = (dispatch: AppDispatch):
  Pick<LoadEventPanelProps, "setEvent"> => {
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

export const LoadEventPanelContainer = connect(mapStateToProps, mapDispatchToProps)(LoadEventPanel)