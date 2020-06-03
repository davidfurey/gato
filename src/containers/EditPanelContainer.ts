import { connect } from "react-redux";
import { EditPanel, EditPanelProps } from "../components/EditPanel";
import { AppDispatch } from "../manage";
import * as EditPanelActions from '../actions/editpanel'
import { EditPane } from "../reducers/editpanel";

const mapDispatchToProps = (dispatch: AppDispatch): Pick<EditPanelProps, 
  "closeTab" | "selectTab" | "openTab"> => {
    return {
      closeTab: (id: string): void => {
        const action: EditPanelActions.Close = {
          type: EditPanelActions.ActionType.Close,
          id,
        }
        dispatch(action)
      },
      selectTab: (id: string): void => {
        const action: EditPanelActions.Select = {
          type: EditPanelActions.ActionType.Select,
          id,
        }
        dispatch(action)
      },
      openTab: (pane: EditPane): void => {
        const action: EditPanelActions.Open = {
          type: EditPanelActions.ActionType.Open,
          pane,
        }
        dispatch(action)
      }
    }
}

export const EditPanelContainer = connect(null, mapDispatchToProps)(EditPanel)