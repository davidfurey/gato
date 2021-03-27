import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent, OSDComponents } from './OSDComponent';
import QuickCreatePanelContainer from './containers/QuickCreatePanelContainer'
import PickedComponentsPanelContainer from './containers/PickedComponentsPanelContainer'
import { Display, OnScreenComponent, OSDLiveEvent, OSDWithState, Styles, Themes } from './reducers/shared'
import { connect } from 'react-redux'
import './style.css';
import { createStore, applyMiddleware, Store } from 'redux'
import { ControlAppState, createReducer } from './reducers/controlapp'
import reduxWebsocket from '@giantmachines/redux-websocket';
import { connect as websocketConnect, send } from '@giantmachines/redux-websocket';
import { ClientStatus } from './api/Responses';
import * as ControlAppActions from './actions/controlapp';
import * as Connectivity from  './actions/connectivity';
import * as RequestMessage from './api/Requests'
import { PageNav } from './components/PageNav';
import { ConnectivityPanelContainer } from './containers/ConnectivityPanelContainer';
import { SettingsPanelContainer } from './containers/SettingsPanelContainer';
import LiveComponentsPanelContainer from './containers/LiveComponentsPanelContainer';
import { PageFooter } from './components/PageFooter';
import { PageStyle } from './components/PageStyle';

interface ControlProps {
  displays: Display[];
  components: OSDComponents;
  themes: Themes;
  styles: Styles;
  events: { [key: string]: OSDLiveEvent };
  connectivity: {
    serverName: string | undefined;
    connected: boolean;
    clients: ClientStatus[];
  };
  eventId: string;
}

let maybeStore: Store<ControlAppState, ControlAppActions.Action> | undefined = undefined

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: (_: WebSocket) => {
    maybeStore ? maybeStore.dispatch(send({"type": RequestMessage.MessageType.GetSharedState })) : null
  },
  reconnectOnClose: true,
});

const store = createStore(createReducer(), applyMiddleware(reduxWebsocketMiddleware))

maybeStore = store

export type AppDispatch = typeof store.dispatch

function socketUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return ((window.location.protocol === 'https:') ? 'wss://' : 'ws://') +
      window.location.host +
      window.location.pathname.replace(/[^/]*$/, '') +
      "control-connection"
  }
  return 'ws://localhost:3040/control-connection'
}

store.dispatch(websocketConnect(socketUrl()));

export class Control extends Component<ControlProps> {
  constructor(props: ControlProps) {
    super(props)
    setInterval(() => {
      if (
        store.getState().connectivity.connected &&
        Date.now() - store.getState().connectivity.lastPong > 2000
      ) {
        store.dispatch({ type: Connectivity.ActionType.Disconnected})
      }
      store.dispatch(send({"type": RequestMessage.MessageType.Ping }))
    }, 1000)
  }

  lookupComponent = (osc: OnScreenComponent):
    OSDWithState<OSDComponent>[] => {
    const component = this.props.components[osc.id]
    if (component) {
      return [{
        state: osc.state,
        component
      }]
    }
    return []
  }

  lookupComponentById = (id: string): OSDComponent[] => {
    const component = this.props.components[id]
    return component ? [component] : []
  }

  render(): JSX.Element {
    const overlayDisplay = this.props.displays.find((d) => d.name === "Overlay")
    const liveEvent = this.props.events[this.props.eventId]

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col col-sm-auto" style={{ width: '30rem' }}>
            { liveEvent ? <PickedComponentsPanelContainer
              title="Picked Components"
              eventId={liveEvent.id} /> : null
              }
              <LiveComponentsPanelContainer title="Live Components" />
            { overlayDisplay ? <QuickCreatePanelContainer
              display={overlayDisplay}
              eventId={this.props.eventId}
            /> : null }
            <SettingsPanelContainer />
            <ConnectivityPanelContainer />
          </div>
          <div className="col-md-auto">
            {this.props.displays.map((display =>
              <ViewPanel
                key={display.id}
                name={display.name}
                showCaption={true}
                preview={true}
                components={display.onScreenComponents.flatMap(this.lookupComponent)}
                parameters={liveEvent?.parameters}
                themes={this.props.themes}
                styles={this.props.styles}
                themeId={liveEvent?.theme || null}
              />
            ))}
{/* <ViewPanel name="Preview" components={this.props.components} showCaption={true} /> */}

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: ControlAppState): ControlProps => {
  return {
    components: state.shared.components,
    displays: state.shared.displays,
    events: state.shared.events,
    connectivity: state.connectivity,
    eventId: state.shared.eventId,
    styles: state.shared.styles,
    themes: state.shared.themes
  }
}

const ControlContainer = connect(mapStateToProps)(Control)

const mapStateToNavProps =
  (state: ControlAppState, ownProps: { page: string }): { event?: string; page: string } => {
  const event = state.shared.events[state.shared.eventId]
  return {
    event: event?.name,
    page: ownProps.page
  }
}

const ConnectedNav = connect(mapStateToNavProps)(PageNav)

ReactDOM.render(
  <Provider store={store}>
    <PageStyle />
    <ConnectedNav page="control" />
    <ControlContainer />
    <PageFooter />
  </Provider>,
  document.getElementById("root")
);
