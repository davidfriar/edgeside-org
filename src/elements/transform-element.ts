import { Context } from '../types'
import jsonata from 'jsonata'

export class TransformElementHandler {
  context: Context
  key: string = ''
  inputKey: string = ''
  transformation: string = ''

  constructor(context: Context) {
    this.context = context
  }
  element(element: Element) {
    this.key = element.getAttribute('data-edgeside-key') || ''
    this.inputKey = element.getAttribute('data-edgeside-input-key') || ''
    this.transformation = ''
    element.removeAndKeepContent()
  }

  async text(text: Text) {
    this.transformation += text.text
    text.remove()
    if (text.lastInTextNode) {
      const input = await this.context.data[this.inputKey]
      console.log('transform handler got data:')
      console.log(await input.clone().text())
      const json = await input.json()
      const expression = jsonata(this.transformation)
      const result = expression.evaluate(json)
      console.log('result of transform')
      console.log(JSON.stringify(result))
      const output = Promise.resolve(new Response(JSON.stringify(result), {}))
      this.context.data[this.key] = output
    }
  }
}
