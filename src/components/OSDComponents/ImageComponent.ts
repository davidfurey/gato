import { OSDComponent } from '../../OSDComponent';

export const ImageType = "image"

export const template: ImageComponent = {
  src: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
  width: 1920,
  height: 1080,
  type: ImageType,
  name: "Boat",
  id: "default",
  top: 0,
  left: 0,
  shared: true,
  style: undefined,
}

export interface ImageComponent extends OSDComponent {
  name: string;
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  type: typeof ImageType;
}

export function isImageComponent(component: OSDComponent): component is ImageComponent {
  return component.type === ImageType
}
