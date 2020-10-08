import { Context } from '../types'
import { QueryElementHandler } from './query-element'

export class RESTElementHandler extends QueryElementHandler {
  constructor(context: Context, url: URL) {
    super(context, url)
  }

  element(element: Element) {
    super.element(element)
    this.executeQuery()
  }

  getDataURL(): string {
    const url = new URL(this.endpoint)
    Object.entries(this.variables).forEach(([name, value]) => {
      if (name.startsWith('$')) {
        url.pathname = url.pathname
          .split('/')
          .map((s) => (s === name ? value : s))
          .join('/')
      } else {
        url.searchParams.append(name, value)
      }
    })
    // console.log(this.variables)
    // console.log(url.toString())
    return url.toString()
  }
}
