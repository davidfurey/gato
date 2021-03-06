import 'core-js/features/object/from-entries';
import express from 'express';
import { Message } from '../api/Messages'
import * as Event from '../api/Events'
import * as Transition from '../api/Transitions'
import * as ThemeMessage from '../api/Themes'
import * as StyleMessage from '../api/Styles'
import { OSDLiveEvent, SharedState, Display, Themes, Styles } from '../reducers/shared'
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
    const event = state().events[eventId === "current" ? state().settings.eventId : eventId]
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
      id: state().settings.eventId
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

  app.get(`${routes.prefix}/export/themes`, (_, res) => {
    res.type('application/json')
      .attachment('themes.json')
      .send(JSON.stringify(state().themes))
  })

  app.get(`${routes.prefix}/export/styles`, (_, res) => {
    res.type('application/json')
      .attachment('styles.json')
      .send(JSON.stringify(state().styles))
  })

  const isThemes = createIs<Themes>()

  app.post(`${routes.prefix}/import/themes`, (req, res) => {
    const body: unknown = req.body
    if (typeof body === 'object' && isThemes(body)) {
      Object.values(body).forEach((theme) => {
        const create: ThemeMessage.Create = {
          type: ThemeMessage.MessageType.Create,
          id: theme.id,
          theme
        }
        processMessage(create)
      })
      res.status(202).send("Accepted")
    } else {
      res.status(400).send("Invalid request")
    }
  })

  const isStyles = createIs<Styles>()

  app.post(`${routes.prefix}/import/styles`, (req, res) => {
    const body: unknown = req.body
    if (typeof body === 'object' && isStyles(body)) {
      Object.values(body).forEach((style) => {
        const create: StyleMessage.Create = {
          type: StyleMessage.MessageType.Create,
          id: style.id,
          style
        }
        processMessage(create)
      })
      res.status(202).send("Accepted")
    } else {
      res.status(400).send("Invalid request")
    }
  })
}