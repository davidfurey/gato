import { connect } from 'react-redux'
import { QuickCreatePanel, QuickCreatePanelProps } from '../components/QuickCreatePanel'
import * as ComponentMessage from '../api/Components'
import * as EventMessage from '../api/Events'
import * as ListMessage from '../api/Lists'
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
      const createComponent: ComponentMessage.CreateLowerThird = {
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
      const addComponent: EventMessage.AddComponent = {
        id: eventId,
        componentId: id,
        type: EventMessage.MessageType.AddComponent,
      }
      const addComponentToList: ListMessage.AddComponent = {
        eventId: eventId,
        name: "quick",
        componentId: id,
        position: -1,
        type: ListMessage.MessageType.AddComponent
      }
      const transition: Transistion.GoTransistion = {
        displayId: display.id,
        type: Transistion.MessageType.Go,
        inComponentId: id,
        transition: "default",
        transistionDuration: 500,
      }
      dispatch(send(createComponent))
      dispatch(send(addComponent))
      dispatch(send(addComponentToList))
      dispatch(send(transition))
    }
  }
}

const mapStateToProps = (state: ControlAppState): Pick<QuickCreatePanelProps, "styles" | "defaultStyle"> => ({
  styles: selectLowerThirdsStyles(state.shared),
  defaultStyle: state.shared.settings.defaultStyles['lower-thirds']
})

const QuickCreatePanelContainer = connect(mapStateToProps, mapDispatchToProps)(QuickCreatePanel)

export default QuickCreatePanelContainer