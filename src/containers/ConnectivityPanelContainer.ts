import { ConnectivityPanel } from "../components/ConnectivityPanel";
import { connect } from "react-redux";
import { BaseAppState } from "../reducers/base";

const mapStateToProps = (state: BaseAppState) => {
  return {
    serverName: state.connectivity.serverName || "streamer-1.yellowbill.co.uk",
    connected: state.connectivity.connected,
    clients: state.connectivity.clients
  }
}

export const ConnectivityPanelContainer = connect(mapStateToProps)(ConnectivityPanel)