import { OSDComponents } from '../OSDComponent'
import * as Transistion from '../api/Transitions'
import { Message } from '../api/Messages'
import * as Component from '../api/Components'
import * as Event from '../api/Events'
import * as ThemeApi from '../api/Themes'
import * as StyleApi from '../api/Styles'
import { reduce as transitionReducer } from './shared/transistion'
import { reduce as componentReducer } from './shared/component'
import { reduce as eventReducer } from './shared/event'
import { reduce as listReducer } from './shared/list'
import { reduce as themeReducer } from './shared/theme'
import { reduce as styleReducer } from './shared/style'
import * as List from '../api/Lists'
import { ImageType } from '../components/OSDComponents/ImageComponent'
import { SlideType } from '../components/OSDComponents/SlideComponent'
import { LowerThirdsType } from '../components/OSDComponents/LowerThirdsComponent'

type uuidv4 = string

export interface SharedState {
  components: OSDComponents;
  events: { [key: string]: OSDLiveEvent };
  displays: Display[];
  eventId: uuidv4;
  themes: { [key: string]: Theme };
  styles: { [key: string]: Style };
}

export interface Theme {
  id: uuidv4;
  name: string;
  parent: uuidv4 | undefined;
  less: string;
  css: string;
}

export interface Style {
  id: uuidv4;
  name: string;
  parent: uuidv4 | undefined;
  less: string;
  css: string;
  componentType: typeof ImageType | typeof SlideType | typeof LowerThirdsType
}

export type ListType = "picked" | "slideshow"

export interface ComponentList {
  name: string;
  listType: ListType;
  components: (uuidv4 | null)[];
}

export interface OSDLiveEvent {
  name: string;
  id: uuidv4;
  components: uuidv4[];
  lists: ComponentList[];
  parameters?: {
    [name: string]: string;
  };
  template?: boolean;
  theme?: uuidv4;
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
  } else if (ThemeApi.isThemeMessage(message)) {
    return themeReducer(message, state)
  } else if (StyleApi.isStyleMessage(message)) {
    return styleReducer(message, state)
  }
  console.error("Unhandled message")
  console.error(message)
  return state
}
