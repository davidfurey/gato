import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup, isType } from "./PatternHelpers"
import { ListType } from '../reducers/shared'

export enum MessageType {
  Create = 'Lists/Create',
  AddComponent = 'Lists/AddComponent',
  MoveComponent = 'Lists/MoveComponent',
  RemoveComponent = 'Lists/RemoveComponent',
  ReplaceItem = 'Lists/ReplaceItem',
  SwapItems = 'Lists/SwapItems'
}

export type Message = 
  Create | 
  AddComponent | 
  MoveComponent | 
  RemoveComponent | 
  ReplaceItem | 
  SwapItems

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

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
  componentId: Uuid; 
  position: number;
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

export interface SwapItems extends BaseMessage<MessageType.SwapItems> {
  eventId: Uuid;
  name: string;
  sourceComponent: Uuid; 
  sourcePosition: number;
  destinationPosition: number;
}

export const isListMessage = isTypeGroup<BaseMessageType, Message>("Lists/")
export const isCreate = isType<BaseMessageType, Create>(MessageType.Create)
export const isAddComponent = isType<BaseMessageType, Create>(MessageType.AddComponent)
export const isMoveComponent = isType<BaseMessageType, Create>(MessageType.MoveComponent)
export const isRemoveComponent = isType<BaseMessageType, Create>(MessageType.RemoveComponent)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher