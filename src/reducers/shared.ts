import { OSDComponent } from '../OSDComponent'
import * as Transistion from '../api/Transitions'
import { Message } from '../api/Messages'
import * as Component from '../api/Components'
import * as Event from '../api/Events'
import { reduce as transitionReducer } from './shared/transistion'
import { reduce as componentReducer } from './shared/component'
import { reduce as eventReducer } from './shared/event'
import { reduce as listReducer } from './shared/list'
import * as List from '../api/Lists'

type uuidv4 = string

export interface SharedState {
  components: { [key: string]: OSDComponent };
  groups: OSDComponentsGroup[];
  events: OSDLiveEvent[];
  displays: Display[];
}

export interface OSDComponentsGroup {
  name: string;
  id: uuidv4;
  components: OSDComponent[];
  hash: string;
}

export type ListType = "picked" | "slideshow"

export interface ComponentList {
  name: string;
  listType: ListType;
  components: uuidv4[];
}

export interface OSDLiveEvent {
  name: string;
  id: uuidv4;
  components: uuidv4[];
  lists: ComponentList[];
}

export type OnScreenComponentState = "entering" | "exiting" | "visible" | "hidden"

export interface OnScreenComponent {
  id: uuidv4;
  state: OnScreenComponentState;
  transitionInTimeMs: number;
  transitionOutTimeMs: number;
  stateStartTimeMs: number;
}

export type ScreenType = "OnAir" | "Preview" 

export interface Display {
  eventId: uuidv4;
  name: string;
  id: uuidv4;
  resolution: Resolution;
  onScreenComponents:  OnScreenComponent[];
  type: ScreenType;
}

export interface Resolution {
  width: number;
  height: number;
}

export function reducer(state: SharedState, message: Message): SharedState {
  if (Transistion.isTransitionMessage(message)) {
    return transitionReducer(message, state)
  } else if (Component.isComponentMessage(message)) {
    return componentReducer(message, state)
  } else if (Event.isEventMessage(message)) {
    return eventReducer(message, state)
  } else if (List.isListMessage(message)) {
    return listReducer(message, state)
  }
  console.error("Unhandled message")
  console.error(message)
  return state
}
