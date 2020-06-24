import { TypeMap, GenericPattern, genericMatcher } from "../api/PatternHelpers"
import * as Connectivity from './connectivity'
import * as EditPanel from './editpanel'
import { WebsocketConnect, WebsocketMessage, GenericWebsocketsAction } from "./websocket"

export type Uuid = string

export type ActionType =
  Connectivity.ActionType

  export type Action =
  Connectivity.Action |
  EditPanel.Action |
  WebsocketConnect |
  WebsocketMessage |
  GenericWebsocketsAction<any>  // eslint-disable-line @typescript-eslint/no-explicit-any

export type Pattern<T> = GenericPattern<TypeMap<ActionType, Action>, T>
export const matcher: <T>(pattern: Pattern<T>) => (message: Action) => T = genericMatcher

export function isWebsocketAction(action: Action): action is WebsocketMessage {
  return action.type.endsWith("MESSAGE")
}