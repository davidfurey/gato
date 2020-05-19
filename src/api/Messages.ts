import * as Component from "./Components"
import * as List from "./Lists"
import * as Display from "./Displays"
import * as Event from "./Events"
import * as Transistion from "./Transitions"
import * as Request from "./Requests"
import * as Response from "./Responses"
import { AnnotatedType, TypeMap, GenericPattern, genericMatcher } from "./PatternHelpers"

export type Uuid = string

export type BaseMessage<T extends MessageType> = AnnotatedType<T>

export type MessageType = 
  Component.MessageType | 
  Display.MessageType | 
  Event.MessageType | 
  List.MessageType | 
  Transistion.MessageType | 
  Request.MessageType |
  Response.MessageType

export type Message = 
  Component.Message | 
  Display.Message | 
  Event.Message | 
  List.Message | 
  Transistion.Message | 
  Request.Message |
  Response.Message

export type BaseMessageType = MessageType

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>
export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher
