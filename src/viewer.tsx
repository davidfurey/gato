import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent } from './OSDComponent';
import { SharedState, Display, OnScreenComponent, OnScreenComponentState, OSDLiveEvent } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { createReducer, ViewerAppState } from './reducers/viewerapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import * as ViewAppActions from './actions/viewapp';
import * as Connectivity from './actions/connectivity';
import * as RequestMessage from './api/Requests'

interface ViewerProps {
  displays: Display[];
  components: OSDComponent[];
  events: OSDLiveEvent[];
}

let maybeStore: Store<ViewerAppState, ViewAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => { maybeStore ? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null },
});

const store = createStore(createReducer(), applyMiddleware(reduxWebsocketMiddleware))

maybeStore = store

export type AppDispatch = typeof store.dispatch

const params = new URLSearchParams(window.location.search)
const displayName = params.get('display') || "live"
const client = params.get('client') || "unknown"

store.dispatch(websocketConnect(`ws://localhost:3040/view-connection?display=${displayName}&client=${client}`));

export class Viewer extends Component<ViewerProps> {

  constructor(props: ViewerProps) {
    super(props)
    // setInterval(() => {
    //   console.log(store.getState())
    // }, 1000)
    setInterval(() => {
      if (
        store.getState().connectivity.connected 
        && Date.now() - store.getState().connectivity.lastPong > 2000) {
        store.dispatch({ type: Connectivity.ActionType.Disconnected})
      }
      store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
    }, 1000)
  }

  lookupComponent = 
  (osc: OnScreenComponent): { state: OnScreenComponentState; component: OSDComponent}[] => {
    const component = this.props.components.find((c) => c.id === osc.id)
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  render(): JSX.Element {
    const display = this.props.displays.find((d) => d.name === displayName)
    return (
      <div>
      {display ?
        <ViewPanel 
          key={display.id} 
          name={display.name} 
          showCaption={false} 
          preview={false}
          components={display.onScreenComponents.flatMap(this.lookupComponent)}
        /> : null}
      </div>
    )
  }
}


interface ViewerApplicationState {
  shared: SharedState;
}

const mapStateToProps = (state: ViewerApplicationState): ViewerProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events
  }
}

const ViewerContainer = connect(mapStateToProps)(Viewer)

ReactDOM.render(
  <Provider store={store}>
    <ViewerContainer />
  </Provider>,
  document.getElementById("root")
);
