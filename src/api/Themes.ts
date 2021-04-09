import { Theme } from '../reducers/shared'
import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  Create = 'Theme/Create',
  Delete = 'Theme/Delete',
  Update = 'Theme/Update',
}

export type Message = Create | Delete | Update

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface Create extends BaseMessage<MessageType.Create> {
  id: Uuid;
  theme: Theme;
}

export interface Delete extends BaseMessage<MessageType.Delete> {
  id: Uuid;
}

export interface Update extends BaseMessage<MessageType.Update> {
  id: Uuid;
  theme: Partial<Theme>;
}

export const isThemeMessage = isTypeGroup<BaseMessageType, Message>("Theme/")

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher