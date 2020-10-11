import { Context } from '../context'

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
}
