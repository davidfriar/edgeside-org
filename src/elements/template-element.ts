import { Context } from '../types'
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
      const result = await this.context.data[this.key]
      // console.log(await result.clone().text())
      const json = await result.json()
      text.after(Mustache.render(this.template, json), { html: true })
    }
  }
}
