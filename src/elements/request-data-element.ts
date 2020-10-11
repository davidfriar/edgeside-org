import { Context } from '../context'
import { BaseElementHandler } from './base-element'

export class RequestDataElementHandler extends BaseElementHandler {
  constructor(context: Context) {
    super(context)
  }

  element(element: Element) {
    super.element(element)
    const request = this.context.request
    console.log(request)
    const data = JSON.stringify({
      url: request.url,
      headers: request.headers,
      cf: request.cf,
      method: request.method,
    })
    // todo. This is horrific. Need to rework how context works so that we don't need
    // to stringify and pack this back into the promise of a response
    this.context.put(this.key, Promise.resolve(new Response(data, {})))
    element.remove()
  }
}
