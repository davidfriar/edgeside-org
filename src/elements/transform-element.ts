import { Context } from '../context'
import jsonata from 'jsonata'
import {
  BaseElementHandler,
  ContextReader,
  ContextWriter,
} from './base-element'

export class TransformElementHandler extends BaseElementHandler {
  input!: ContextReader
  output!: ContextWriter
  transformation!: string

  constructor(context: Context) {
    super(context)
  }

  element(element: Element) {
    this.input = this.getContextReader(element)
    this.output = this.getContextWriter(element)
    this.transformation = ''
    element.removeAndKeepContent()
  }

  async text(text: Text) {
    this.transformation += text.text
    text.remove()
    if (text.lastInTextNode) {
      const json = await this.input.getJSON()
      const expression = jsonata(this.transformation)
      const result = expression.evaluate(json)
      this.output.putObject(result)
    }
  }
}
