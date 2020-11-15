import { Context } from 'edgeside'
import { RESTElementHandler } from 'edgeside'

export class KurtosysElementHandler extends RESTElementHandler {
  kurtosysToken: string = 'fc92cd68-b71c-4994-8e23-da1971402ae8'
  isin: string = 'GB00BD6FFQ03'

  constructor(context: Context) {
    super(context)
  }

  fetchData(): Promise<Response> {
    const url = this.getDataURL()

    return fetch(url, {
      method: 'POST',
      headers: {
        'X-KSYS-TOKEN': this.kurtosysToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body:
        '{"type":"CLSS","search":[{"property":"isin","values":["' +
        this.isin +
        '"],"matchtype":"MATCH"}],"include":{"timeseries":{},"disclaimers":{}},"culture":"en-GB","applyFormats":false,"start":0,"limit":1,"fundList":"view_uk_pri_OEIC","sort":{"key":"infinite_sort","direction":"ASC"}}',
      cf: { cacheTtl: this.cacheTTL, cacheEverything: true },
    })
  }
}
