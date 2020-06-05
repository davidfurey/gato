import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup, isType } from "./PatternHelpers"
import { LowerThirdsComponent } from "../components/OSDComponents/LowerThirdsComponent"
import { OSDComponent } from "../OSDComponent"

export enum MessageType {
  Create = 'Component/Create',
  CreateLowerThird = 'Component/Create/LowerThird',
  Delete = 'Component/Delete',
  Update = 'Component/Update',
  Share = 'Component/Share',
  Unshare = 'Component/Unshare',
}

export type Message = Create | Delete | CreateLowerThird | Update

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface Create extends BaseMessage<MessageType.Create> {
  id: Uuid;
  component: OSDComponent;
}

export interface Update extends BaseMessage<MessageType.Update> {
  id: Uuid;
  component: Partial<OSDComponent>;
}

export interface Share extends BaseMessage<MessageType.Share> {
  id: Uuid;
}

export interface Unshare extends BaseMessage<MessageType.Unshare> {
  id: Uuid;
}

export interface CreateLowerThird extends BaseMessage<MessageType.CreateLowerThird> {
  id: Uuid;
  component: LowerThirdsComponent;
}

export interface Delete extends BaseMessage<MessageType.Delete> {
  id: Uuid;  
}

export const isComponentMessage = isTypeGroup<BaseMessageType, Message>("Component/")
export const isCreate = isType<BaseMessageType, Create>(MessageType.Create)
export const isCreateLowerThird = 
  isType<BaseMessageType, CreateLowerThird>(MessageType.CreateLowerThird)
export const isDelete = isType<BaseMessageType, Delete>(MessageType.Delete)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher