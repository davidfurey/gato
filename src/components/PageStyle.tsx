import React, { useState, useEffect } from 'react';
import { Style, Styles, Theme, Themes } from '../reducers/shared'
import { connect } from 'react-redux'
import { ControlAppState } from '../reducers/controlapp'
import less from 'less'
import { Helmet } from "react-helmet";
import { notEmpty } from '../api/FunctionalHelpers';

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

// Ensure parent styles are included before children
// so that CSS precendence is as expected
function traverseStyles(
  styles: Style[],
  visited: string[] = []
): string[] {
  const batch = styles
    .filter((s) => s.parent === null || visited.includes(s.parent))
    .map((s) => s.id)
  const remaining = styles
    .filter((s) => !(s.parent === null || visited.includes(s.parent)))
  if (batch.length === 0) {
    return visited
  } else {
    return traverseStyles(remaining, visited.concat(batch))
  }
}

export function compileCss(
  themes: Themes,
  styles: Styles,
  themeId: string | null
): Promise<string> {
  const less = `.view-panel-content {
    ${ancestors(themeId, themes).map((t) => t.less).join('\n')}
    ${traverseStyles(Object.values(styles))
      .map((sId) => styles[sId])
      .filter(notEmpty)
      .map((s) => `.style_${s.id} { ${s.less} }`)
      .join('\n')
    }
  }`
  return renderLess(less)
}

function PageStyleComponent(props: PageStyleComponentProps): JSX.Element {
  const [css, setCss] = useState("")

  useEffect(() => {
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
    themeId: state.shared.events[state.shared.settings.eventId]?.theme || null
  }
}

export const PageStyle = connect(mapStateToProps)(PageStyleComponent)