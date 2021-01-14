import { OSDLiveEvent } from '../reducers/shared'
import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup, isType } from "./PatternHelpers"

export enum MessageType {
  Create = 'Event/Create',
  Delete = 'Event/Delete',
  Update = 'Event/Update',
  Load = 'Event/Load',
  AddComponent = 'Event/AddComponent',
  RemoveComponent = 'Event/RemoveComponent',
}

export type Message = Create | Delete | Update | AddComponent | RemoveComponent | Load

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface Create extends BaseMessage<MessageType.Create> {
  id: Uuid;
  name: string;
  event?: Partial<OSDLiveEvent>;
}

export interface Delete extends BaseMessage<MessageType.Delete> {
  id: Uuid;
}

export interface Update extends BaseMessage<MessageType.Update> {
  id: Uuid;
  name: string;
}

export interface AddComponent extends BaseMessage<MessageType.AddComponent> {
  id: Uuid;
  componentId: Uuid;
}

export interface RemoveComponent extends BaseMessage<MessageType.RemoveComponent> {
  id: Uuid;
  componentId: Uuid;
}

export interface Load extends BaseMessage<MessageType.Load> {
  id: Uuid;
}

export const isEventMessage = isTypeGroup<BaseMessageType, Message>("Event/")
export const isCreate = isType<BaseMessageType, Create>(MessageType.Create)
export const isDelete = isType<BaseMessageType, Delete>(MessageType.Delete)
export const isUpdate = isType<BaseMessageType, Update>(MessageType.Update)
export const isAddComponent = isType<BaseMessageType, AddComponent>(MessageType.AddComponent)
export const isRemoveComponent =
  isType<BaseMessageType, RemoveComponent>(MessageType.RemoveComponent)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher
