import { handleRequest } from 'edgeside'
import { KurtosysElementHandler } from './elements/kurtosys-element'

addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request, {
      elements: [['securerest', KurtosysElementHandler]],
      urlRewriteRules: [
        [
          'welcome-to-the-edge/.*/country-matters.html',
          'welcome-to-the-edge/country-matters.html',
        ],
        ['demo1/.*/country.html', 'demo1/country.html'],
        ['demo1/.*/continent.html', 'demo1/continent.html'],
        ['demo1/.*/continent.html', 'demo1/continent.html'],
        ['demo1/.*/time.html', 'demo1/time.html'],
        [
          '/etc/cloudsettings.kernel.js/libs/settings/cloudsettings/legacy/contexthub',
          'hacktostopthisloading',
        ],
      ],
    }),
  )
})
