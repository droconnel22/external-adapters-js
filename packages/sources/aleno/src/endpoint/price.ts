import { AdapterEndpoint } from '@chainlink/external-adapter-framework/adapter'
import { InputParameters } from '@chainlink/external-adapter-framework/validation'
import { SingleNumberResultResponse } from '@chainlink/external-adapter-framework/util'
import { TransportRoutes } from '@chainlink/external-adapter-framework/transports'
import { config } from '../config'
import overrides from '../config/overrides.json'

import { httpTransport } from '../transport/price-http'
// import { customSubscriptionTransport } from '../transport/price-custombg'

// // Input parameters define the structure of the request expected by the endpoint. The second parameter defines example input data that will be used in EA readme
export const inputParameters = new InputParameters(
  {
    base: {
      aliases: ['from', 'coin', 'symbol', 'market'],
      required: true,
      type: 'string',
      description: 'The symbol of symbols of the currency to query',
    },
    quote: {
      aliases: ['to', 'convert'],
      required: true,
      type: 'string',
      description: 'The symbol of the currency to convert to',
    },
  },
  [
    {
      base: 'BTC',
      quote: 'USD',
    },
  ],
)

// Endpoints contain a type parameter that allows specifying relevant types of an endpoint, for example, request payload type, Adapter response type and Adapter configuration (environment variables) type
export type BaseEndpointTypes = {
  Parameters: typeof inputParameters.definition
  Response: SingleNumberResultResponse
  Settings: typeof config.settings
}

export const endpoint = new AdapterEndpoint({
  // Endpoint name
  name: 'price',
  // Alternative endpoint names for this endpoint
  aliases: ['crypto', 'state'],
  // Transport handles incoming requests, data processing and communication for this endpoint.
  // In case endpoint supports multiple transports (i.e. http and websocket) TransportRoutes is used to register all supported transports.
  // To use specific transport, provide `transport: [transportName]` in the request
  transportRoutes: new TransportRoutes<BaseEndpointTypes>()
    // .register('rest', httpTransport)  .register('custombg', customSubscriptionTransport),
    .register('rest', httpTransport),
  inputParameters,
  overrides: overrides['aleno'],
})
