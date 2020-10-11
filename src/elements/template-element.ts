import { Context } from '../context'
import Mustache from 'mustache'

export class TemplateElementHandler {
  context: Context
  key: string = ''
  template: string = ''

  constructor(context: Context) {
    this.context = context
  }
  element(element: Element) {
    this.key = element.getAttribute('data-edgeside-key') || ''
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
