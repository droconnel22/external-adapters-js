import { AdapterEndpoint } from '@chainlink/external-adapter-framework/adapter'
import { HttpRequestConfig } from '@chainlink/external-adapter-framework/transports'
import { BatchWarmingTransport } from '@chainlink/external-adapter-framework/transports/batch-warming'
import {
  buildGlobalRequestBody,
  constructEntry,
  GlobalEndpointTypes,
  inputParameters,
} from '../global-utils'

const batchEndpointTransport = new BatchWarmingTransport<GlobalEndpointTypes>({
  prepareRequest: (_, config): HttpRequestConfig<never> => {
    return buildGlobalRequestBody(config.API_KEY)
  },
  parseResponse: (params, res) =>
    params.map((requestPayload) => constructEntry(res, requestPayload, 'total_market_cap')),
})

export const endpoint = new AdapterEndpoint({
  name: 'globalmarketcap',
  aliases: ['total_market_cap'],
  transport: batchEndpointTransport,
  inputParameters,
})
