import { connect } from 'react-redux'
import { QuickCreatePanel, QuickCreatePanelProps } from '../components/QuickCreatePanel'
import * as ComponentMessage from '../api/Components'
import * as EventMessage from '../api/Events'
import * as Transistion from '../api/Transitions'
import { v4 as uuid } from 'uuid';
import { send } from '@giantmachines/redux-websocket';
import { Display, SharedState } from '../reducers/shared'
import { AppDispatch } from '../control'
import { createSelector } from 'reselect'
import { ControlAppState } from '../reducers/controlapp'

const selectStyles = (state: SharedState) =>
  state.styles

export const selectLowerThirdsStyles = createSelector(
  selectStyles,
  (styles) =>
    Object.values(styles).filter((s) => s.componentType === "lower-thirds")
)

const mapDispatchToProps = (dispatch: AppDispatch):
  Pick<QuickCreatePanelProps, "show"> => {
  return {
    show: (title: string,
      subtitle: string,
      display: Display,
      eventId: string,
      styleId: string | null
    ): void => {
      const id = uuid();
      const action: ComponentMessage.CreateLowerThird = {
        id,
        type: ComponentMessage.MessageType.CreateLowerThird,
        component: {
          id,
          name: title,
          title,
          subtitle,
          type: "lower-thirds",
          shared: false,
          className: undefined,
          style: styleId,
        }
      }
      dispatch(send(action))
      const action2: EventMessage.AddComponent = {
        id: eventId,
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
// this should work without the timeout because each dispatched action forces a re-render
      }, 100);
    }
  }
}

const mapStateToProps = (state: ControlAppState): Pick<QuickCreatePanelProps, "styles" | "defaultStyle"> => ({
  styles: selectLowerThirdsStyles(state.shared),
  defaultStyle: state.shared.settings.defaultStyles['lower-thirds']
})

const QuickCreatePanelContainer = connect(mapStateToProps, mapDispatchToProps)(QuickCreatePanel)

export default QuickCreatePanelContainer