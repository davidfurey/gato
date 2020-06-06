import { connect } from "react-redux";
import { SharedStatus, SharedStatusProps } from "../components/SharedStatus";
import { OSDComponent } from "../OSDComponent";
import { ManageAppState } from "../reducers/manageapp";
import { AppDispatch } from "../manage";
import * as ComponentMessage from '../api/Components'
import { send } from '@giantmachines/redux-websocket';

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

const mapStateToProps = (state: ManageAppState,
  ownProps: ShareComponentButtonContainerProps): Pick<SharedStatusProps, 
  "events" | "shared"> => {
    return {
      events: Object.values(state.shared.events).filter(
        (e) => e.components.includes(ownProps.component.id)),
      shared: ownProps.component.shared
    }
}

export const SharedStatusContainer = 
  connect(mapStateToProps, mapDispatchToProps)(SharedStatus)