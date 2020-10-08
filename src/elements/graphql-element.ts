import { Context } from '../types'
import { QueryElementHandler } from './query-element'

export class GraphQLElementHandler extends QueryElementHandler {
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
