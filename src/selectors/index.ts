import { createSelector } from "reselect"
import { OSDComponent, OSDComponents } from "../OSDComponent"
import { SharedState } from "../reducers/shared"

const selectDisplays = (state: SharedState) =>
  state.displays

const selectComponents = (state: SharedState) =>
  state.components

export const selectEvents = (state: SharedState) =>
  state.events

export const selectOnAirDisplays = createSelector(
  selectDisplays,
  (displays) =>
    displays.filter((d) => d.type === "OnAir")
)

export const selectVisibleComponentIds = createSelector(
  selectOnAirDisplays,
  (onAirDisplays) => {
    return onAirDisplays.flatMap((d) =>
      d.onScreenComponents.filter((c) => c.state === "entering" || c.state === "visible").map((c) => c.id)
    )
  }
)

const lookupComponentById = (components: OSDComponents) => {
  return (id: string): OSDComponent[] => {
    const component = components[id]
    return component ? [component] : []
  }
}

export const selectVisibleComponents = createSelector(
    selectVisibleComponentIds,
    selectComponents,
    (visibleComponents, components) =>
      visibleComponents.flatMap(lookupComponentById(components))
)

const selectEventComponents = (state: SharedState) =>
    (state.events[state.eventId]?.components || [])

export const eventComponents = createSelector(
  selectEventComponents,
  selectComponents,
  (components, allComponents) => components.flatMap(lookupComponentById(allComponents))
)

export const selectNonTemplates = createSelector(
  selectEvents,
  (events) =>
    Object.values(events).filter((evt) => !evt.template)
)


