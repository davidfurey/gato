import 'core-js/features/object/from-entries';
import express from 'express';
import { Message } from '../api/Messages'
import * as Event from '../api/Events'
import * as Transition from '../api/Transitions'
import { OSDLiveEvent, SharedState, Display } from '../reducers/shared'
import { OSDComponent } from '../OSDComponent';
import { createIs } from 'typescript-is';
import { notEmpty } from '../api/FunctionalHelpers';
import { ApiRouteHelpers } from './api-helpers';
import * as core from 'express-serve-static-core'

export function createApiRoutes(
  app: core.Express,
  state: () => SharedState,
  processMessage: (m: Message) => void
): void {

  const events = (): OSDLiveEvent[] => Object.values(state().events)

  const displays = (): Display[] => state().displays

  function eventComponents(eventId: string): OSDComponent[] {
    const event = state().events[eventId === "current" ? state().eventId : eventId]
    return event ?
      event.components.map((cId) => state().components[cId]).filter(notEmpty) :
      []
  }

  function fields<T>(include: (keyof T)[]): (obj: T) => Partial<T> {
    return (obj) => include.reduce((acc, key) => (
      {
        ...acc,
        [key]: obj[key]
      }
    ), {} as Partial<T>)
  }

  function currentEventFilter<T extends { id: string }>(pathArgs: T): T {
    return pathArgs.id === "current" ? {
      ...pathArgs,
      id: state().eventId
    } : pathArgs
  }

  app.use(express.json())

  const routes = new ApiRouteHelpers(app, processMessage)

  routes.collection('/events', events, fields(["name", "id"]))
  routes.message('/events', createIs<Event.Create>(), Event.MessageType.Create)

  routes.item('/events/:id', (id) => state().events[id])
  routes.message('/events/:id', createIs<Event.Update>(), Event.MessageType.Update, currentEventFilter)
  routes.message('/events/:id/load', createIs<Event.Load>(), Event.MessageType.Load, currentEventFilter)
  routes.message('/events/:id/parameters/:name', createIs<Event.UpsertParameter>(), Event.MessageType.UpsertParameter, currentEventFilter)
  routes.collection('/events/:id/components', (p) => eventComponents(p.id), fields(["name", "id"]))

  routes.item('/components/:id', (id) => state().components[id])

  routes.collection('/displays', displays, fields(["name", "id"]))
  routes.message('/displays/:displayId/transistion', createIs<Transition.GoTransistion>(), Transition.MessageType.Go)
}