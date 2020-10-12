import { Context } from '../context'
import { BaseElementHandler } from './base-element'
import { parse, eval } from 'expression-eval'

export class HTMLIncludeElementHandler extends BaseElementHandler {
  endpoint: string = ''
  cacheTTL: number = 60

  constructor(context: Context) {
    super(context)
  }

  async element(element: Element) {
    super.element(element)
    this.endpoint = this.getAttribute('data-edgeside-endpoint', element)
    if (element.hasAttribute('data-edgeside-cache-ttl')) {
      this.cacheTTL = parseInt(
        this.getAttribute('data-edgeside-cache-ttl', element),
      )
    }
    element.after(await this.fetchHTML(), { html: true })
    element.remove()
  }

  private async fetchHTML(): Promise<string> {
    const url = await this.getIncludeURL()
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        Accept: 'text/html',
      },
      cf: { cacheTtl: this.cacheTTL, cacheEverything: true },
    })
    if (response.ok) {
      return response.text()
    } else {
      console.log('%s did not return OK', url.toString())
      return ''
    }
  }

  private async getIncludeURL(): Promise<string> {
    const url = await this.replaceExpressions(this.endpoint)
    const absoluteURL = new URL(url, this.context.originURL)
    return absoluteURL.toString()
  }

  private async replaceExpressions(s: string): Promise<string> {
    if (this.context.hasData(this.key)) {
      const data = await this.context.getJSON(this.key)
      // match expressions like ${foo}
      const re = /\$\{[^}]*\}/g
      return s.replace(re, (x) => {
        //use a function to evaluate any matches
        const expression = x.substring(2, x.length - 1) // remove the '${' and '}'
        const ast = parse(expression)
        const result = eval(ast, data)
        return result
      })
    } else {
      return s
    }
  }
}
