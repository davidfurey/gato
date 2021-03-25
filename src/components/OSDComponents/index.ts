import { OSDComponent } from "../../OSDComponent";
import { ComponentType, OSDWithState, Style, Styles } from "../../reducers/shared";
import { ImageType } from "./ImageComponent";
import { LowerThirdsType } from "./LowerThirdsComponent";
import { SlideType } from "./SlideComponent";

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

export function classes(styleId: string | null, styles: Styles): string {
  return ancestors(styleId, styles).map((s) => `style_${s.id}`).join(" ")
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
