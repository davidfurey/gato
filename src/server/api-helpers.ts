import 'core-js/features/object/from-entries';
import * as core from 'express-serve-static-core'
import { ParsedQs } from 'qs';
import { Message } from '../api/Messages'

type PathParams<Path extends string> =
    Path extends `:${infer Param}/${infer Rest}` ? Param | PathParams<Rest> :
    Path extends `:${infer Param}` ? Param :
    Path extends `${infer ignored}:${infer Rest}` ? PathParams<`:${Rest}`> :
    never;

type PathArgs<Path extends string> = {
  [K in PathParams<Path>]: string
};

type Typify<T> = { [ K in keyof T ]: T[ K ] };

type SearchTerm = [string, string]

function hasOwnProperty<X extends Record<string, unknown>, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return prop in obj
}

function parseSearch(q: undefined | string | string[] | ParsedQs | ParsedQs[]): SearchTerm[] {
  return typeof q === 'string' ?
    q.split(',').reduce((acc, item) => {
      const [k, v] = item.split(':')
      return k !== undefined && v !== undefined ? acc.concat([[k, v]]) : acc
    }, [] as SearchTerm[]) : []
}

function paramAsNumber(
  param: undefined | string | string[] | ParsedQs | ParsedQs[]
): number | undefined {
  return typeof param === 'string' ? parseInt(param) : undefined
}

export class ApiRouteHelpers {

  readonly prefix = "/api"

  app: core.Express
  processMessage: (m: Message) => void

  constructor(app: core.Express, processMessage: (m: Message) => void) {
    this.app = app
    this.processMessage = processMessage

    app.post(`${this.prefix}/`, (req, res, next) => {
      if (req.is("application/json")) {
        return next();
      }
      return res.status(415).send('Unsupported Media Type')
    })
  }

  message = <
    T extends Message,
    P extends string
  >(
    path: P,
    validator: (object: unknown) => object is T,
    type: T['type'],
    modifier: (args: PathArgs<P>) => PathArgs<P> = (x) => x
  ): void => {
    this.app.post<PathArgs<P>>(`${this.prefix}${path}`, (req, res) => {
      const body: unknown = req.body
      if (typeof body === 'object') {
        const combined = {
          ...body,
          ...modifier(req.params),
          type,
        }
        if (validator(combined)) {
          this.processMessage(combined)
          res.send("Ok")
        } else {
          res.status(400).send("Invalid request")
        }
      } else {
        res.status(400).send("Invalid request")
      }
    })
  }

  item = <Prefix extends string, Path extends `${Prefix}/:id`, T>(
    path: Path,
    lookup: (id: string) => T | undefined,
  ): void => {
    this.app.get<{id: string}>(`${this.prefix}${path}`, (req, res) => {
      const id = req.params.id
      const item = lookup(id)
      if (item) {
        res.json(item)
      } else {
        return res.status(404).send('Not found')
      }
    })
  }

  collection = <T, U, P extends string>(
    path: P,
    lookup: (args: PathArgs<P>) => Typify<T>[],
    transform: (v: T) => U): void => {
    this.app.get<PathArgs<P>>(`${this.prefix}${path}`, (req, res) => {
      const pageSize = paramAsNumber(req.query['page-size']) || 10
      const page = paramAsNumber(req.query['page']) || 1
      const search = parseSearch(req.query['q'])
      res.json(
        lookup(req.params)
          .filter((item) => search.every(([k, v]) => hasOwnProperty(item, k) && item[k] === v))
          .slice((page - 1) * pageSize, page * pageSize)
          .map(transform)
      )
    })
  }
}