import { Context } from '../types'

export abstract class QueryElementHandler {
  context: Context
  endpoint: string = ''
  key: string = ''
  cacheTTL: number = 60
  variables: Object = {}
  url: URL

  constructor(context: Context) {
    this.context = context
    this.url = new URL(context.request.url)
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
    this.context.data[this.key] = promise
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
