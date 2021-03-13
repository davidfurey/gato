import { Style } from '../reducers/shared'
import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  Create = 'Style/Create',
  Delete = 'Style/Delete',
  Update = 'Style/Update',
}

export type Message = Create | Delete | Update

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface Create extends BaseMessage<MessageType.Create> {
  id: Uuid;
  style: Style;
}

export interface Delete extends BaseMessage<MessageType.Delete> {
  id: Uuid;
}

export interface Update extends BaseMessage<MessageType.Update> {
  id: Uuid;
  style: Partial<Style>;
}

export const isStyleMessage = isTypeGroup<BaseMessageType, Message>("Style/")

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher