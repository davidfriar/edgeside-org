import { Context } from '../context'
import { parse, eval } from 'expression-eval'

const ATTR_PREFIX = 'data-edgeside-'

export abstract class BaseElementHandler {
  context: Context
  key: string = ''

  constructor(context: Context) {
    this.context = context
  }

  element(element: Element) {
    this.key = this.getAttribute('key', element)
  }

  protected getAttribute(attributeName: string, element: Element): string {
    const value = element.getAttribute(ATTR_PREFIX + attributeName)
    if (!value) {
      throw new Error(
        'Edgeside element is missing required attribute: ' + attributeName,
      )
    }
    return value
  }

  protected getOptionalAttribute(
    attributeName: string,
    element: Element,
  ): string | undefined {
    if (this.hasAttribute(attributeName, element)) {
      return this.getAttribute(attributeName, element)
    } else {
      return undefined
    }
  }

  protected hasAttribute(attributeName: string, element: Element): boolean {
    return element.hasAttribute(ATTR_PREFIX + attributeName)
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
    console.log('entering replaceExpressions. data:', data)
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
