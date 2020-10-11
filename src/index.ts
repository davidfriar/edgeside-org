import { handleRequest } from './request-handler'
import { Config } from './types'
import { DebugElementHandler } from './elements/debug-element'

const config: Config = {
  elements: [
    // custom element handlers here e.g.
    ['debug', DebugElementHandler],
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
  event.respondWith(handleRequest(event.request, config))
})
