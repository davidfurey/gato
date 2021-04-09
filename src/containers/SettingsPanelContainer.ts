import { SettingsPanel, SettingsPanelProps } from '../components/SettingsPanel'
import { ControlAppState } from '../reducers/controlapp'
import { connect } from 'react-redux'
import { AppDispatch } from '../control'
import * as Settings from '../api/Settings'
import { send } from '@giantmachines/redux-websocket';
import { ComponentType } from '../reducers/shared'

const mapStateToProps = (state: ControlAppState):
  Pick<SettingsPanelProps, "settings" | "events" | "themes" | "styles"> => {
  return {
    events: state.shared.events,
    settings: state.shared.settings,
    themes: state.shared.themes,
    styles: state.shared.styles,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch):
  Pick<SettingsPanelProps, "setDefaultStyle" | "setEvent"> => {
  return {
    setDefaultStyle: (styleId: string | null, componentType: ComponentType) => {
      const action: Settings.UpdateDefaultStyle = {
        type: Settings.MessageType.UpdateDefaultStyle,
        componentType,
        styleId,
      }
      dispatch(send(action))
    },
    setEvent: () => {
      console.warn('missing function')
    }
  }
}

export const SettingsPanelContainer = connect(mapStateToProps, mapDispatchToProps)(SettingsPanel)