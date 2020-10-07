import Mustache from 'mustache'

type Context = { [key: string]: Promise<Response> }

declare var ORIGIN_HOST: string
declare var ORIGIN_PROTOCOL: string
declare var ORIGIN_CACHE_TTL: number
declare var ORIGIN_CACHE_EVERYTHING: boolean

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request): Promise<Response> {
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

abstract class QueryElementHandler {
  context: Context
  url: URL
  endpoint: string = ''
  key: string = ''
  cacheTTL: number = 60
  variables: Object = {}

  constructor(context: Context, url: URL) {
    this.context = context
    this.url = url
  }

  element(element: Element) {
    this.endpoint = element.getAttribute('data-edgeside-endpoint') || ''
    this.key = element.getAttribute('data-edgeside-key') || ''
    if (element.hasAttribute('data-edgeside-cache-ttl')) {
      this.cacheTTL = parseInt(
        element.getAttribute('data-edgeside-cache-ttl') as string,
      )
    }
    this.variables = this.parseParameterMap(
      element.getAttribute('data-edgeside-parameter-map') || '',
    )
  }

  parseParameterMap(parameterMap: string) {
    if (parameterMap) {
      return Object.fromEntries(
        parameterMap
          .trim()
          .split(/\s*,\s*/)
          .map((x) => x.split(/\s*\:\s*/, 2))
          .map((x) => (x.length == 1 ? x.concat(x) : x))
          .map(([k, v]) => [k, this.getParam(v)]),
      )
    } else {
      return {}
    }
  }

  getParam(paramName: string) {
    const match = paramName.match(/\$(\d*)$/) // "$" followed by digits
    if (match && match.length) {
      const n = parseInt(match[1])
      const segments = this.url.pathname.split('/')
      return segments[segments.length - n - 1]
    } else {
      return this.url.searchParams.get(paramName)
    }
  }

  storeData(promise: Promise<Response>) {
    this.context[this.key] = promise
  }

  abstract getDataURL(): string

  fetchData(): Promise<Response> {
    const url = this.getDataURL()
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cf: { cacheTtl: this.cacheTTL, cacheEverything: true },
    })
  }

  executeQuery() {
    this.storeData(this.fetchData())
  }
}

class GraphQLElementHandler extends QueryElementHandler {
  query: string = ''
  constructor(context: Context, url: URL) {
    super(context, url)
  }

  element(element: Element) {
    this.query = ''
    super.element(element)
  }

  text(text: Text) {
    this.query += text.text
    if (text.lastInTextNode) {
      this.executeQuery()
    }
  }

  getDataURL(): string {
    const q = encodeURIComponent(this.query)
    const v = encodeURIComponent(JSON.stringify(this.variables))
    return `${this.endpoint}?query=${q}&variables=${v}`
  }
}

class RESTElementHandler extends QueryElementHandler {
  constructor(context: Context, url: URL) {
    super(context, url)
  }

  element(element: Element) {
    super.element(element)
    this.executeQuery()
  }

  getDataURL(): string {
    const url = new URL(this.endpoint)
    Object.entries(this.endpoint).forEach(([name, value]) =>
      url.searchParams.append(name, value),
    )
    return url.toString()
  }
}

class TemplateElementHandler {
  context: Context
  key: string = ''
  template: string = ''

  constructor(context: Context) {
    this.context = context
  }
  element(element: Element) {
    this.key = element.getAttribute('data-edgeside-key') || ''
    this.template = ''
    element.removeAndKeepContent()
  }

  async text(text: Text) {
    this.template += text.text
    text.remove()
    if (text.lastInTextNode) {
      const result = await this.context[this.key]
      const json = await result.json()
      text.after(Mustache.render(this.template, json.data), { html: true })
    }
  }
}
