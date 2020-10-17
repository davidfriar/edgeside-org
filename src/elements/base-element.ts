import { Context } from '../context'
import { parse, eval } from 'expression-eval'

export abstract class BaseElementHandler {
  context: Context
  key: string = ''

  constructor(context: Context) {
    this.context = context
  }

  element(element: Element) {
    this.key = this.getAttribute('data-edgeside-key', element)
  }

  protected getAttribute(attributeName: string, element: Element): string {
    const value = element.getAttribute(attributeName)
    if (!value) {
      throw new Error(
        'Edgeside element is missing required attribute: ' + attributeName,
      )
    }
    return value
  }

  protected async replaceExpressionsWithKeyData(s: string): Promise<string> {
    if (this.context.hasData(this.key)) {
      const data = await this.context.getJSON(this.key)
      return this.replaceExpressions(s, data)
    } else {
      return s
    }
  }

  protected replaceExpressions(s: string, data: any): string {
    // match expressions like ${foo}
    const re = /\$\{[^}]*\}/g
    return s.replace(re, (x) => {
      //use a function to evaluate any matches
      const expression = x.substring(2, x.length - 1) // remove the '${' and '}'
      const ast = parse(expression)
      const result = eval(ast, data)
      return result
    })
  }
}
