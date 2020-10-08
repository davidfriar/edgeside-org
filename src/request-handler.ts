import {
  GraphQLElementHandler,
  RESTElementHandler,
  TemplateElementHandler,
} from './elements'
import { Context } from './types'

declare const ORIGIN_HOST: string
declare const ORIGIN_PROTOCOL: string
declare const ORIGIN_CACHE_TTL: number
declare const ORIGIN_CACHE_EVERYTHING: boolean

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  url.host = ORIGIN_HOST
  url.protocol = ORIGIN_PROTOCOL
  const response = await fetch(url.toString(), {
    cf: {
      cacheTtl: ORIGIN_CACHE_TTL,
      cacheEverything: ORIGIN_CACHE_EVERYTHING,
    },
  })

  const context: Context = {}

  return new HTMLRewriter()
    .on(
      "script[type='application/graphql']",
      new GraphQLElementHandler(context, url),
    )
    .on("script[type='application/rest']", new RESTElementHandler(context, url))
    .on("script[type='x-tmpl-mustache']", new TemplateElementHandler(context))
    .transform(response)
}
