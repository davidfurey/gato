import React, { useState, useEffect } from 'react';
import { Styles, Theme, Themes } from '../reducers/shared'
import { connect } from 'react-redux'
import { ControlAppState } from '../reducers/controlapp'
import less from 'less'
import { Helmet } from "react-helmet";

function renderLess(css: string): Promise<string> {
  return less.render(css).then((output) => output.css)
}

function ancestors(
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

interface PageStyleComponentProps {
  themes: Themes;
  styles: Styles;
  themeId: string | null;
}

export function compileCss(
  themes: Themes,
  styles: Styles,
  themeId: string | null
): Promise<string> {
  const less = `.view-panel-content {
    ${ancestors(themeId, themes).map((t) => t.less).join('\n')}
    ${Object.values(styles).map((s) => `.style_${s.id} { ${s.less} }`).join('\n')}
  }`
  return renderLess(less)
}

function PageStyleComponent(props: PageStyleComponentProps): JSX.Element {
  const [css, setCss] = useState("")

  useEffect(() => {
    // todo: stop recompiling less every second
    void compileCss(props.themes, props.styles, props.themeId).then((data) => {
      setCss(data)
    })
  }, [props.styles, props.themes, props.themeId] )

  return <Helmet><style type="text/css">{css}</style></Helmet>
}

const mapStateToProps =
  (state: ControlAppState): Pick<PageStyleComponentProps, "themes" | "styles" | "themeId"> => {

  return {
    themes: state.shared.themes,
    styles: state.shared.styles,
    themeId: state.shared.events[state.shared.eventId]?.theme || null
  }
}

export const PageStyle = connect(mapStateToProps)(PageStyleComponent)