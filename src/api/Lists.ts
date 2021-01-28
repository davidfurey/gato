import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { isTypeGroup, isType } from "./PatternHelpers"
import { ListType } from '../reducers/shared'

export enum MessageType {
  Create = 'Lists/Create',
  AddComponent = 'Lists/AddComponent',
  MoveComponent = 'Lists/MoveComponent',
  RemoveComponent = 'Lists/RemoveComponent',
  ReplaceItem = 'Lists/ReplaceItem'
}

export type Message =
  Create |
  AddComponent |
  MoveComponent |
  RemoveComponent |
  ReplaceItem

export interface Create extends BaseMessage<MessageType.Create> {
  eventId: Uuid;
  name: string;
  listType: ListType;
}

export interface AddComponent extends BaseMessage<MessageType.AddComponent> {
  eventId: Uuid;
  name: string;
  componentId: Uuid | null;
  position: number;
}

export interface MoveComponent extends BaseMessage<MessageType.MoveComponent> {
  eventId: Uuid;
  name: string;
  componentId: Uuid | null;
  sourcePosition: number;
  destinationPosition: number;
}

export interface RemoveComponent extends BaseMessage<MessageType.RemoveComponent> {
  eventId: Uuid;
  name: string;
  componentId: Uuid | null;
  position: number;
}

export interface ReplaceItem extends BaseMessage<MessageType.ReplaceItem> {
  eventId: Uuid;
  name: string;
  componentId: Uuid;
  position: number;
}

export const isListMessage = isTypeGroup<BaseMessageType, Message>("Lists/")
export const isCreate = isType<BaseMessageType, Create>(MessageType.Create)
export const isAddComponent = isType<BaseMessageType, Create>(MessageType.AddComponent)
export const isMoveComponent = isType<BaseMessageType, Create>(MessageType.MoveComponent)
export const isRemoveComponent = isType<BaseMessageType, Create>(MessageType.RemoveComponent)
