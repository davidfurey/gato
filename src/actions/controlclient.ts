// import { WebsocketConnect, WebsocketMessage, GenericWebsocketsAction } from './websocket'

// export type ControlClientAction = 
//   WebsocketConnect | 
//   WebsocketMessage | 
//   GenericWebsocketsAction<any> | // eslint-disable-line @typescript-eslint/no-explicit-any
//   LocalAction

// export enum LocalMessageType {
//   Disconnected = 'Local/Disconnected',
// }

// interface LocalAction {
//   type: LocalMessageType;
// }

// export interface Disconnected extends LocalAction {
//   type: LocalMessageType.Disconnected;
// }