import { Context } from '../context'
import jsonata from 'jsonata'
import { BaseElementHandler } from './base-element'

export class TransformElementHandler extends BaseElementHandler {
  inputKey: string = ''
  transformation: string = ''

  constructor(context: Context) {
    super(context)
  }
  element(element: Element) {
    super.element(element)
    this.inputKey = this.getAttribute('input-key', element)
    this.transformation = ''
    element.removeAndKeepContent()
  }

  async text(text: Text) {
    this.transformation += text.text
    text.remove()
    if (text.lastInTextNode) {
      const json = await this.context.getJSON(this.inputKey)
      const expression = jsonata(this.transformation)
      const result = expression.evaluate(json)
      const output = Promise.resolve(new Response(JSON.stringify(result), {}))
      this.context.put(this.key, output)
    }
  }
}
