import { OSDComponent } from "../../OSDComponent";
import { ComponentType, OSDWithState, Style, Styles } from "../../reducers/shared";
import { ImageType } from "./ImageComponent";
import { LowerThirdsType } from "./LowerThirdsComponent";
import { SlideType } from "./SlideComponent";
import React from 'react';

export const componentTypes: ComponentType[] = [LowerThirdsType, ImageType, SlideType]

export function isComponentType(type: string): type is ComponentType {
  return (componentTypes as string[]).includes(type)
}

export function componentTypeAsString(type: ComponentType): string {
  switch (type) {
    case LowerThirdsType: return "Banner"
    case ImageType: return "Image"
    case SlideType: return "Slide"
  }
}

export function ancestors(
  styleId: string | null,
  styles: Styles,
  selectedStyles: Style[] = []
): Style[] {
  const style = styleId ? styles[styleId] : null
  const styleVisited = (item: Style) => selectedStyles.some((t) => t.id === item.id)

  if (style && !styleVisited(style)) {
    return ancestors(style.parent, styles, [style, ...selectedStyles])
  } else {
    return selectedStyles
  }
}

export function usedStyles(
  components: OSDWithState<OSDComponent>[],
  allStyles: Styles
): Record<string, boolean> {
  return components.reduce<{[id: string]: boolean }>((agg, c) => {
    const styles = ancestors(c.component.style || null, allStyles)
    const visible = c.state === "entering" || c.state === "visible"
    styles.forEach((s) => {
      agg[s.id] =  agg[s.id] || visible
    })
    return agg
  }, {})
}

export interface StylesTreeNode {
  id: string;
  name: string;
  visible: boolean;
  children: StylesTreeNode[];
}

function updateTree(
  tree: StylesTreeNode,
  child: Style,
  descendents: Style[],
  visible: boolean
) {
  const existingNode = tree.children.find((s) => s.id === child.id)
  const newNode = {
    id: child.id,
    name: child.name,
    visible,
    children: []
  }
  if (!existingNode) {
    tree.children.push(newNode)
  } else if (visible) {
    existingNode.visible = visible
  }
  const next = descendents[0]
  if (next) {
    updateTree(existingNode || newNode, next, descendents.slice(1), visible)
  }
}

export function usedStylesTree(
  components: OSDWithState<OSDComponent>[],
  allStyles: Styles
): StylesTreeNode {
  const tree: StylesTreeNode = {
    id: 'root',
    name: 'root',
    children: [],
    visible: false
  }
  components.forEach((c) => {
    const styles = ancestors(c.component.style || null, allStyles)
    const visible = c.state === "entering" || c.state === "visible"
    if (styles[0]) {
      updateTree(tree, styles[0], styles.slice(1), visible)
    }
  })
  return tree
}

export function renderNode<T extends OSDComponent>(
  tree: StylesTreeNode,
  components: OSDWithState<T>[],
  styles: Styles,
  fn: (a: OSDWithState<T>, styles: Styles) => JSX.Element
): JSX.Element {
  return <div key={tree.id} className={`style_${tree.id} ` + (tree.visible ? "component-visible" : "component-hidden")}>
    <div className="shared-extra1"><span></span></div>
    <div className="shared-extra2"><span></span></div>
    <div className="shared-extra3"><span></span></div>
    <div className="shared-extra4"><span></span></div>
    { components.filter((c) => c.component.style === tree.id).map((c) =>
      fn(c, styles)
    )}
    { tree.children.map((n) => renderNode(n, components, styles, fn))}
  </div>
}