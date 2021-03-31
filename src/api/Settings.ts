import { Settings } from '../reducers/shared'
import { BaseMessage, BaseMessageType } from './Messages'
import { TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  UpdateParameter = 'Settings/UpdateParameter',
}

export type Message = UpdateParameter

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

export interface UpdateParameter extends BaseMessage<MessageType.UpdateParameter> {
  name: keyof Pick<Settings, "defaultStyle" | "defaultTheme">;
  value: string;
}

export const isSettingsMessage = isTypeGroup<BaseMessageType, Message>("Settings/")

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher