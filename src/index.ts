import { handleRequest } from './request-handler'
import { Config } from './types'
import { DebugElementHandler } from './elements'
import { KurtosysElementHandler } from './elements'

const config: Config = {
  elements: [
    // custom element handlers here e.g.
    ['debug', DebugElementHandler],
    ['securerest', KurtosysElementHandler],
  ],
  urlRewriteRules: [
    // custom rewrite rules here
    [
      'welcome-to-the-edge/.*/country-matters.html',
      'welcome-to-the-edge/country-matters.html',
    ],
    ['demo1/.*/country.html', 'demo1/country.html'],
    [
      '/etc/cloudsettings.kernel.js/libs/settings/cloudsettings/legacy/contexthub',
      'hacktostopthisloading',
    ],
  ],
  converters: {
    //custom converters here
  },
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, config))
})
