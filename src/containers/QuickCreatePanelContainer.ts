import { connect } from 'react-redux'
import { QuickCreatePanel } from '../components/QuickCreatePanel'
import * as ComponentMessage from '../api/Components'
import * as EventMessage from '../api/Events'
import * as Transistion from '../api/Transitions'
import { uuid } from 'uuidv4'
import { send } from '@giantmachines/redux-websocket';
import { Display } from '../reducers/shared'
import { AppDispatch } from '../control'


// (dispatch: Dispatch<Action>, ownProps: TOwnProps) => TDispatchProps;
// MapDispatchToPropsFactory<TDispatchProps, TOwnProps> |
// MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    show: (title: string, subtitle: string, display: Display): void => {
      const id = uuid();
      const action: ComponentMessage.CreateLowerThird = {
        id,
        type: ComponentMessage.MessageType.CreateLowerThird,
        component: {
          id,
          name: title,
          title,
          subtitle,
          type: "lower-thirds"
        }
      }
      dispatch(send(action))
      const action2: EventMessage.AddComponent = {
        id: display.eventId,
        componentId: id,
        type: EventMessage.MessageType.AddComponent,
      }
      dispatch(send(action2))
      setTimeout(() => {
        const action2: Transistion.GoTransistion = {
          displayId: display.id,
          type: Transistion.MessageType.Go,
          inComponentId: id,
          transition: "default",
          transistionDuration: 500,
        }
        dispatch(send(action2)) 
// this should work without the timeoutbecause each dispatched action forces a re-render
      }, 100);
    }
  }
}

const QuickCreatePanelContainer = connect(null, mapDispatchToProps)(QuickCreatePanel)

export default QuickCreatePanelContainer