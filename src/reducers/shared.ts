import { OSDComponent, OSDComponents } from '../OSDComponent'
import * as Transistion from '../api/Transitions'
import { Message } from '../api/Messages'
import * as Component from '../api/Components'
import * as Event from '../api/Events'
import * as ThemeApi from '../api/Themes'
import * as StyleApi from '../api/Styles'
import * as SettingsApi from '../api/Settings'
import { reduce as transitionReducer } from './shared/transistion'
import { reduce as componentReducer } from './shared/component'
import { reduce as eventReducer } from './shared/event'
import { reduce as listReducer } from './shared/list'
import { reduce as themeReducer } from './shared/theme'
import { reduce as styleReducer } from './shared/style'
import { reduce as settingsReducer } from './shared/settings'
import * as List from '../api/Lists'
import { ImageType } from '../components/OSDComponents/ImageComponent'
import { SlideType } from '../components/OSDComponents/SlideComponent'
import { LowerThirdsType } from '../components/OSDComponents/LowerThirdsComponent'

type uuidv4 = string

export type ComponentType = typeof ImageType | typeof SlideType | typeof LowerThirdsType

export interface SharedState {
  components: OSDComponents;
  events: OSDLiveEvents;
  displays: Display[];
  themes: Themes;
  styles: Styles;
  settings: Settings;
}

export interface Settings {
  eventId: uuidv4,
  defaultStyle: uuidv4 | null,
  defaultTheme: uuidv4 | null,
}

export interface Theme {
  id: uuidv4;
  name: string;
  parent: uuidv4 | null;
  less: string;
}

export type Themes = { [key: string]: Theme }

export interface Style {
  id: uuidv4;
  name: string;
  parent: uuidv4 | null;
  less: string;
  componentType: ComponentType
}

export type Styles = { [key: string]: Style }

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
  theme?: uuidv4 | null;
}

export type OSDLiveEvents = { [key: string]: OSDLiveEvent }

export type OnScreenComponentState = "entering" | "exiting" | "visible" | "hidden"

export interface OSDWithState<T extends OSDComponent> {
  state: OnScreenComponentState;
  component: T;
}

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
  } else if (SettingsApi.isSettingsMessage(message)) {
    return settingsReducer(message, state)
  }
  console.error("Unhandled message")
  console.error(message)
  return state
}
