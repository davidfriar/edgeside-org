export type Context = {
  request: Request
  data: { [key: string]: Promise<Response> }
}

export type Converter = (input: Promise<Response>) => Promise<Response>

interface ElementHandlerConstructor {
  new (context: Context): ElementHandler
}

export interface Config {
  elements: Array<[string, ElementHandlerConstructor]>
  urlRewriteRules: Array<[string, string]>
  converters: { [key: string]: Converter }
}
