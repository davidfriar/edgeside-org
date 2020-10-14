import { handleRequest } from './request-handler'
import { Config } from './types'
import { DebugElementHandler } from './elements'
import { KurtosysElementHandler } from './elements'

const config: Config = {
  elements: [
    // custom element handlers here e.g.
    ['debug', DebugElementHandler],
    ['kurtosys', KurtosysElementHandler],
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
