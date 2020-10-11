declare const DEBUG: boolean

export class Context {
  readonly request: Request
  private data: { [key: string]: Promise<Response> }

  constructor(request: Request) {
    this.data = {}
    this.request = request
  }

  put(key: string, promise: Promise<Response>) {
    this.data[key] = promise
  }

  async getJSON(key: string) {
    const response = await this.getResponse(key)
    const json = await response.json()
    //todo : when we have better performance testing, consider caching
    //parsed json instead of reparsing if data is used multiple times

    if (DEBUG) {
      console.log('Getting JSON from context for key %s', key)
      console.log(JSON.stringify(json))
    }
    return json
  }

  async getText(key: string) {
    const response = await this.getResponse(key)
    const text = response.text()
    if (DEBUG) {
      console.log('Getting text from context for key %s', key)
      console.log(text)
    }
    return text
  }

  private async getResponse(key: string): Promise<Response> {
    // Cloudflare implementation of response.clone doesn't seem to allow multiple concurrent
    // reads of the body, so using tee()
    const response = await this.data[key]
    if (response && response.body) {
      const body = response.body.tee()
      this.data[key] = Promise.resolve(new Response(body[0], {}))
      return new Response(body[1], {})
    } else {
      throw new Error('Could not find any data for key: ' + key)
    }
  }
}
