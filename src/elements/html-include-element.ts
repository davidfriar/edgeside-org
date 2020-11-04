import { Context } from '../context'
import { BaseElementHandler } from './base-element'

declare const ORIGIN_PATH_PREFIX: string

export class HTMLIncludeElementHandler extends BaseElementHandler {
  endpoint: string = ''
  cacheTTL: number = 60

  constructor(context: Context) {
    super(context)
  }

  async element(element: Element) {
    super.element(element)
    this.endpoint = this.getAttribute('endpoint', element)
    if (element.hasAttribute('cache-ttl')) {
      this.cacheTTL = parseInt(this.getAttribute('cache-ttl', element))
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
    let url = await this.replaceExpressionsWithKeyData(this.endpoint)
    if (url.startsWith('/')) {
      try {
        url = '/' + ORIGIN_PATH_PREFIX + url
      } catch (e) {
        //ignore
      }
    }
    const absoluteURL = new URL(url, this.context.originURL)
    return absoluteURL.toString()
  }
}
