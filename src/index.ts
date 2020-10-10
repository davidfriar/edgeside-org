import { handleRequest } from './request-handler'
import { Config } from './types'

const config: Config = {
  elements: [
    // custom element handlers here
  ],
  urlRewriteRules: [
    // custom rewrite rules here
    [
      'welcome-to-the-edge/.*/country-matters.html',
      'welcome-to-the-edge/country-matters.html',
    ],
  ],
  converters: {
    //custom converters here
  },
}

addEventListener('fetch', (event) => {
  console.log('hello, just checking if we have been deployed')
  event.respondWith(handleRequest(event.request, config))
})
