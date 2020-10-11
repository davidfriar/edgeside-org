import { Context } from '../context'
import { BaseElementHandler } from './base-element'

export class DebugElementHandler extends BaseElementHandler {
  constructor(context: Context) {
    super(context)
  }

  async element(element: Element) {
    super.element(element)
    element.after(await this.context.getText(this.key))
  }
}
