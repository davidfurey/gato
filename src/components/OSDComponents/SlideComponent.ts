import { OSDComponent } from '../../OSDComponent';

export const SlideType = "slide"

export const template: SlideComponent = {
  src: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
  width: 1920,
  height: 1080,
  type: SlideType,
  name: "Boat",
  id: "default",
  top: 0,
  left: 0,
  shared: true,
  title: "(title)",
  subtitle: "(subtitle)",
  body: "(body)",
  className: undefined,
  style: undefined,
}

export interface SlideComponent extends OSDComponent {
  name: string;
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  type: typeof SlideType;
  title: string;
  subtitle: string;
  body: string | undefined;
  className: string | null | undefined;
}

export function isSlideComponent(component: OSDComponent): component is SlideComponent {
  return component.type === SlideType
}
