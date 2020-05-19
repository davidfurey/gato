import { BaseMessage, BaseMessageType } from './Messages'
import { isType, TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"
import { SharedState } from '../reducers/shared'

export type ClientInterface = "control" | "view" | "manage"

export interface ClientStatus {
  name: string;
  interface: ClientInterface;
  screenName: string | undefined;
  connected: "yes" | "no" | "missed-ping";
  id: string;
}

export enum MessageType {
  SharedState = 'Response/SharedState',
  Pong = 'Response/Pong',
}

export type Message = State
export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface State extends BaseMessage<MessageType.SharedState> {
  state: SharedState;
}

export interface Pong extends BaseMessage<MessageType.Pong> {
  clients: ClientStatus[];
}

export const isResponseMessage = isTypeGroup<BaseMessageType, Message>("Response/")
export const isState = isType<BaseMessageType, State>(MessageType.SharedState)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher