import { Context } from '../context'

export class DebugElementHandler {
  context: Context
  key: string = ''

  constructor(context: Context) {
    this.context = context
  }
  async element(element: Element) {
    this.key = element.getAttribute('data-edgeside-key') || ''
    element.after(await this.context.getText(this.key))
  }
}
