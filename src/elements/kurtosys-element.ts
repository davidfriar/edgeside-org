import { Context } from '../context'
import { RESTElementHandler } from './rest-element'

export class KurtosysElementHandler extends RESTElementHandler {
	constructor(context: Context) {
		super(context)
	}

	fetchData(): Promise<Response> {
		const url = this.getDataURL()

		return fetch(url, {
			method: 'POST',
			headers: {
				'X-KSYS-TOKEN': 'fc92cd68-b71c-4994-8e23-da1971402ae8',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: '{"type":"CLSS","search":[{"property":"isin","values":["GB00BD6FFQ03"],"matchtype":"MATCH"}],"include":{"timeseries":{},"allocations":{},"statistics":{},"disclaimers":{},"commentaries":{},"documents":{"joinSpec":[{"joinTo":"isin"}]}},"culture":"en-GB","applyFormats":false,"start":0,"limit":10,"fundList":"view_uk_pri_OEIC","sort":{"key":"infinite_sort","direction":"ASC"}}',
			cf: { cacheTtl: this.cacheTTL, cacheEverything: true },
		});
	}
}
