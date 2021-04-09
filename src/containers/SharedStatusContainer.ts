import { connect } from "react-redux";
import { SharedStatus, SharedStatusProps } from "../components/SharedStatus";
import { OSDComponent } from "../OSDComponent";
import { ManageAppState } from "../reducers/manageapp";
import { AppDispatch } from "../manage";
import * as ComponentMessage from '../api/Components'
import { send } from '@giantmachines/redux-websocket';
import { SharedState } from "../reducers/shared";
import { createSelector } from "reselect";
import { selectEvents } from "../selectors";

interface ShareComponentButtonContainerProps {
  component: OSDComponent;
}

const mapDispatchToProps = (dispatch: AppDispatch,
  ownProps: ShareComponentButtonContainerProps): Pick<SharedStatusProps,
  "share" | "unshare"> => {
    return {
      share: (): void => {
        const action: ComponentMessage.Share = {
          type: ComponentMessage.MessageType.Share,
          id: ownProps.component.id,
        }
        dispatch(send(action))
      },
      unshare: (): void => {
        const action: ComponentMessage.Unshare = {
          type: ComponentMessage.MessageType.Unshare,
          id: ownProps.component.id,
        }
        dispatch(send(action))
      }
    }
}

const selectSharedId = (_: SharedState, props: ShareComponentButtonContainerProps) =>
    props.component.id

const makeMapStateToProps = () => {
  const selectUsedByEvents = createSelector(
    selectEvents,
    selectSharedId,
    (events, componentId) => Object.values(events).filter(
      (e) => e.components.includes(componentId))
  )

  return (state: ManageAppState,
    ownProps: ShareComponentButtonContainerProps): Pick<SharedStatusProps,
    "events" | "shared"> => {
      return {
        events: selectUsedByEvents(state.shared, ownProps),
        shared: ownProps.component.shared
      }
  }
}

export const SharedStatusContainer =
  connect(makeMapStateToProps, mapDispatchToProps)(SharedStatus)