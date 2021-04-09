import React, { useState, useEffect } from 'react';
import { Style, Styles, Theme, Themes } from '../reducers/shared'
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

interface TreeNode {
  children: TreeNode[];
  style: Style
}

const nodeFromStyle = (style: Style): TreeNode => ({
  style: style,
  children: []
})

function createTree(styles: Style[]): TreeNode[] {
  const prototypeTree: { [id: string]: TreeNode } =
    Object.fromEntries(styles.map((s) => [s.id, nodeFromStyle(s)]))

  Object.values(prototypeTree).forEach((n) => {
    if (n.style.parent) {
      prototypeTree[n.style.parent]?.children.push(n)
    }
  })

  return Object.values(prototypeTree).filter((n) => n.style.parent === null)
}

function traverseTree(tree: TreeNode): string {
  return `.style_${tree.style.id} { // ${tree.style.name}
      ${tree.style.less}
      ${tree.children.map(traverseTree).join('\n')}
  }`
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
    ${createTree(Object.values(styles)).map(traverseTree).join('\n')}
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