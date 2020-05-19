import { BaseMessage, BaseMessageType } from './Messages'
import { isType, TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  GetSharedState = 'Request/GetSharedState',
  Ping = 'Request/Ping'
}

export type Message = GetState | Ping
export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export type GetState = BaseMessage<MessageType.GetSharedState>

export type Ping = BaseMessage<MessageType.GetSharedState>

export const isRequestMessage = isTypeGroup<BaseMessageType, Message>("Request/")
export const isState = isType<BaseMessageType, GetState>(MessageType.GetSharedState)
export const isPing = isType<BaseMessageType, Ping>(MessageType.Ping)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher