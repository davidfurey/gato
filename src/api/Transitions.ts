import { Uuid, BaseMessage, BaseMessageType } from './Messages'
import { isType, TypeMap, GenericPattern, genericMatcher, isTypeGroup } from "./PatternHelpers"

export enum MessageType {
  Go = 'Transition/Go',
}

export type Message = GoTransistion
export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>

type TransitionType = "default" | "cut"

export interface GoTransistion extends BaseMessage<MessageType.Go> {
  displayId: Uuid;
  outComponentId?: Uuid;
  inComponentId?: Uuid;
  transition: TransitionType;
  transistionDuration: number;
}

export const isTransitionMessage = isTypeGroup<BaseMessageType, Message>("Transition/")
export const isGo = isType<BaseMessageType, GoTransistion>(MessageType.Go)

export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher