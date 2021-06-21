import { OSDComponent } from '../OSDComponent'
import React from 'react';
import { LowerThirds } from './OSDComponents/LowerThirds';
import { Images } from './OSDComponents/Image';
import { Slides } from './OSDComponents/Slide';
import { ImageComponent, ImageType } from './OSDComponents/ImageComponent';
import { LowerThirdsComponent, LowerThirdsType } from './OSDComponents/LowerThirdsComponent';
import { EventParameters, OSDWithState, Styles, Theme, Themes } from '../reducers/shared'
import { SlideComponent, SlideType } from './OSDComponents/SlideComponent';

export function ancestors(
  themeId: string | null,
  themes: Themes,
  selectedThemes: Theme[] = []
): Theme[] {
  const theme = themeId ? themes[themeId] : null
  const themeVisited = (item: Theme) => selectedThemes.some((t) => t.id === item.id)

  if (theme && !themeVisited(theme)) {
    return ancestors(theme.parent, themes, [theme, ...selectedThemes])
  } else {
    return selectedThemes
  }
}


interface ViewPanelProps {
  name: string;
  components: OSDWithState<OSDComponent>[];
  themes: Themes;
  styles: Styles;
  themeId: string | null;
  showCaption: boolean;
  preview: boolean;
  parameters?: EventParameters;
}

export function ViewPanel(props: ViewPanelProps): JSX.Element {

  const visibleComponentSummary = (): string => {
    // todo: sort visibleComponents by name to avoid jumping
    const visibleComponents = props.components.filter((c) => c.state === "entering" || c.state === "visible").sort(
      (a, b) => a.component.name < b.component.name ? -1 : 1
    )
    const [first, second, third] = visibleComponents
    if (first && second && third) {
      return `${first.component.name}, ${second.component.name}, etc`
    } else if (first && second) {
      return `${first.component.name} and ${second.component.name}`
    } else if (first) {
      return first.component.name
    }
    return "(blank)"
  }

  const lowerThirdsComponents = (
    components: OSDWithState<OSDComponent>[]
  ): OSDWithState<LowerThirdsComponent>[] => {
    return components.filter((c) => c.component.type === LowerThirdsType) as
    OSDWithState<LowerThirdsComponent>[]
  }

  const imageComponents = (
    components: OSDWithState<OSDComponent>[]
  ): OSDWithState<ImageComponent>[] => {
    return components.filter((c) => c.component.type === ImageType) as
    OSDWithState<ImageComponent>[]
  }

  const slideComponents = (
    components: OSDWithState<OSDComponent>[]
  ): OSDWithState<SlideComponent>[] => {
    return components.filter((c) => c.component.type === SlideType) as
    OSDWithState<SlideComponent>[]
  }

  const themes = ancestors(props.themeId, props.themes)
  return (
    <div className="view-panel">
      <div className={(props.preview ? "view-panel-content view-panel-content-preview " : "view-panel-content ")
        + themes.map((t) => `theme_${t.id}`).join(" ")}>
      <LowerThirds
        components={lowerThirdsComponents(props.components)}
        parameters={props.parameters}
        styles={props.styles}
      />
      <Images
        components={imageComponents(props.components)}
        parameters={props.parameters}
        styles={props.styles}
      />
      <Slides
        components={slideComponents(props.components)}
        parameters={props.parameters}
        styles={props.styles}
      />
      </div>
      { props.showCaption ?
      <div className="view-panel-caption">
        <span className="view-panel-name">{props.name}</span>:&nbsp;
        <span className="view-panel-component">{visibleComponentSummary()}</span>
      </div>
      : null}
    </div>
  )
}