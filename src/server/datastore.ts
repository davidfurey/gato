import fs from 'fs'
import { OSDComponents } from '../OSDComponent'
import { Display, OSDLiveEvents, Themes, Styles, SharedState, Settings } from '../reducers/shared'

const emptyCallback = (): void => {
  // do nothing.
}

function store<T>(filename: string): (item: T) => void {
  return (item) => {
    fs.mkdirSync('config', { recursive: true })
    fs.writeFile(`config/${filename}`, JSON.stringify(item), {}, emptyCallback)
  }
}

export const storeComponents = store<OSDComponents>('components.json')
export const storeDisplays = store<Display[]>('displays.json')
export const storeEvents = store<OSDLiveEvents>('events.json')
export const storeThemes = store<Themes>('themes.json')
export const storeStyles = store<Styles>('styles.json')
export const storeSettings = store<Settings>('settings.json')

function load<T>(filename: string): Promise<T> {
  const p = fs.promises.readFile(`config/${filename}`, 'utf8').then((data) => JSON.parse(data) as T)
  p.catch((error) => { console.log(`Error parsing ${filename}`); console.log(error) })
  return p
}

export function loadState(state: SharedState): void {
  void load<OSDComponents>('components.json').then((components) => {
    state['components'] = components
  })
  void load<Display[]>('displays.json').then((displays) => {
    state['displays'] = displays
  })
  void load<OSDLiveEvents>('events.json').then((events) => {
    state['events'] = events
  })
  void load<Themes>('themes.json').then((themes) => {
    state['themes'] = themes
  })
  void load<Styles>('styles.json').then((styles) => {
    state['styles'] = styles
  })
  void load<Settings>('settings.json').then((settings) => {
    state['settings'] = settings
  })
}