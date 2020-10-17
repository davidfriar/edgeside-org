import { Context } from '../context'
import { BaseElementHandler } from './base-element'

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
    const url = await this.replaceExpressionsWithKeyData(this.endpoint)
    const absoluteURL = new URL(url, this.context.originURL)
    return absoluteURL.toString()
  }
}
