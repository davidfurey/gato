import { uuid } from "uuidv4"
import { ComponentList, OSDLiveEvent } from "../reducers/shared"
import { copy as copyComponent, OSDComponent } from '../OSDComponent'
import * as EventActions from '../api/Events'
import * as ComponentActions from '../api/Components'

function copyList(componentMapping: { [id: string]: string }) {
  return (ls: ComponentList): ComponentList => {
    return {
      ...ls,
      components: ls.components.map((id) => id ? componentMapping[id] || null : null)
    }
  }
}

function copyComponents(
  componentIds: string[],
  allComponents: { [key: string]: OSDComponent }
): [ComponentActions.Create[], string[]] {
  return componentIds.reduce(
    ([components, ids]: [ComponentActions.Create[], string[]] , cId) => {
      const component = allComponents[cId] // todo: gracefully handle null
      if (component === undefined) {
        console.log(cId)
        console.log(allComponents)
      }
      if (component.shared) {
        return [components, ids.concat([cId])]
      } else {
        const newComponent = copyComponent(component, uuid())
        return [components.concat([newComponent]), ids.concat([newComponent.id])]
      }
    },
    [[], []]
  )
}

function copyLists(
  lists: ComponentList[],
  componentMapping: { [id: string]: string }
): ComponentList[] {
  return lists.map(copyList(componentMapping))
}

function objectZip<T>(a: string[], b: T[]): { [name: string]: T } {
  return b.reduce((result: { [name: string]: T }, field, index) => {
    result[a[index]] = field
    return result;
  }, {})
}

export function copyEvent(
  name: string,
  sourceId: string,
  events: { [id: string]: OSDLiveEvent},
  components: { [id: string]: OSDComponent},
): (EventActions.Create | ComponentActions.Create)[] {
  const sourceEvent = events[sourceId]
  if (!sourceEvent) {
    throw "Attempted to copy a event that does not exist"
  }
  const [newComponents, newComponentIds] =
    copyComponents(sourceEvent.components, components)
  const newEvent: OSDLiveEvent = {
    name: name,
    id: uuid(),
    components: newComponentIds,
    lists: copyLists(sourceEvent.lists, objectZip(sourceEvent.components, newComponentIds)),
  }
  const newEventAction: EventActions.Create = {
    type: EventActions.MessageType.Create,
    id: newEvent.id,
    name: name,
    event: newEvent
  }
  return [newEventAction, ...newComponents]
}