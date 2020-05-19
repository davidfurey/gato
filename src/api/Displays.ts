import { Resolution } from '../reducers/shared'
import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { isType, TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  Create = 'Display/Create',
  Delete = 'Display/Delete',
  Update = 'Display/Update',
}

export type Message = Create | Delete | Update

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface Create extends BaseMessage<MessageType.Create> {
  id: Uuid;
  eventId: Uuid;
  name: string;
  resolution: Resolution;
}

export interface Delete extends BaseMessage<MessageType.Delete> {
  id: Uuid;
}

export interface Update extends BaseMessage<MessageType.Update> {
  id: Uuid;
  eventId: Uuid;
  name: string;
  resolution: Resolution;
}

export const isDisplayMessage = isTypeGroup<BaseMessageType, Message>("Display/")
export const isCreate = isType<BaseMessageType, Create>(MessageType.Create)
export const isDelete = isType<BaseMessageType, Delete>(MessageType.Delete)
export const isUpdate = isType<BaseMessageType, Update>(MessageType.Update)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher