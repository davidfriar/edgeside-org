import { Config } from './types'
import {
  GraphQLElementHandler,
  RESTElementHandler,
  TemplateElementHandler,
  ConditionalElementHandler,
  RequestDataElementHandler,
  TransformElementHandler,
  HTMLIncludeElementHandler,
} from './elements'

export const defaultConfig: Config = {
  elements: [
    ['graphql', GraphQLElementHandler],
    ['rest', RESTElementHandler],
    ['template', TemplateElementHandler],
    ['conditional', ConditionalElementHandler],
    ['request-data', RequestDataElementHandler],
    ['transform', TransformElementHandler],
    ['html-include', HTMLIncludeElementHandler],
  ],
  urlRewriteRules: [],
  converters: {},
}

export function mergeConfig(config: Config, config2: Config): Config {
  return {
    elements: config.elements.concat(config2.elements),
    urlRewriteRules: config.urlRewriteRules.concat(config2.urlRewriteRules),
    converters: { ...config.converters, ...config2.converters },
  }
}
