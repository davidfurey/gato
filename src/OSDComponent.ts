import * as ComponentActions from './api/Components'

export interface OSDComponent {
  id: string;
  name: string;
  type: string;
  shared: boolean;
}

export function copy(component: OSDComponent, newId: string): ComponentActions.Create {
  return {
    id: newId,
    type: ComponentActions.MessageType.Create,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: {
      ...JSON.parse(JSON.stringify(component)),
      id: newId
    }
  }
}