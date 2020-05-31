import { OSDComponent } from '../../OSDComponent';

export const LowerThirdsType = "lower-thirds"

export const template: LowerThirdsComponent = {
  title: "(title)",
  subtitle: "(subtitle)",
  type: LowerThirdsType,
  name: "default",
  id: "default",
}

export interface LowerThirdsComponent extends OSDComponent {
  title: string;
  subtitle: string;
  type: typeof LowerThirdsType;
}

export function isLowerThirdsComponent(component: OSDComponent): component is LowerThirdsComponent {
  return component.type === LowerThirdsType
}
