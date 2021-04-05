import { ComponentType } from '../reducers/shared'
import { BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  UpdateDefaultStyle = 'Settings/UpdateDefaultStyle'
}

export type Message = UpdateDefaultStyle

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface UpdateDefaultStyle extends BaseMessage<MessageType.UpdateDefaultStyle> {
  componentType: ComponentType;
  styleId: string | null;
}

export const isSettingsMessage = isTypeGroup<BaseMessageType, Message>("Settings/")

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher