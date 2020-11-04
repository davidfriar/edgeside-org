import { Context } from '../context'
import { BaseElementHandler } from './base-element'
import { parse, eval } from 'expression-eval'

export class ConditionalElementHandler extends BaseElementHandler {
  constructor(context: Context) {
    super(context)
  }

  async element(element: Element) {
    super.element(element)
    const expression = this.getAttribute('expression', element)
    const ast = parse(expression.replace(/&#39;/g, "'"))
    const data = await this.context.getJSON(this.key)
    const result = eval(ast, data)
    if (result) {
      element.removeAndKeepContent()
    } else {
      element.remove()
    }
  }
}
