import { Context } from '../context'
import Mustache from 'mustache'
import { BaseElementHandler } from './base-element'

export class TemplateElementHandler extends BaseElementHandler {
  template: string = ''

  constructor(context: Context) {
    super(context)
  }

  element(element: Element) {
    super.element(element)
    this.template = ''
    element.removeAndKeepContent()
  }

  async text(text: Text) {
    this.template += text.text
    text.remove()
    if (text.lastInTextNode) {
      const json = await this.context.getJSON(this.key)
      text.after(Mustache.render(this.template, json), { html: true })
    }
  }
}
