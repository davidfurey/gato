import * as Component from "./Components"
import * as List from "./Lists"
import * as Display from "./Displays"
import * as Event from "./Events"
import * as Transistion from "./Transitions"
import * as Theme from "./Themes"
import * as Style from "./Styles"
import * as Settings from "./Settings"
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
  Theme.MessageType |
  Style.MessageType |
  Settings.MessageType |
  Request.MessageType |
  Response.MessageType

export type Message =
  Component.Message |
  Display.Message |
  Event.Message |
  List.Message |
  Transistion.Message |
  Theme.Message |
  Style.Message |
  Settings.Message |
  Request.Message |
  Response.Message

export type BaseMessageType = MessageType

export type Pattern<T> = GenericPattern<TypeMap<MessageType, Message>, T>
export const matcher: <T>(pattern: Pattern<T>) => (message: Message) => T = genericMatcher
