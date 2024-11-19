import { HttpTransport } from '@chainlink/external-adapter-framework/transports'
import { BaseEndpointTypes } from '../endpoint/price'

export interface ResponseSchema {
  [index: number]: {
    id: string
    baseSymbol: string
    quoteSymbol: string
    processTimestamp: number
    processBlockChainId: string
    processBlockNumber: number
    processBlockTimestamp: number
    aggregatedLast7DaysBaseVolume: number
    price: number
    aggregatedMarketDepthMinusOnePercentUsdAmount: number
    aggregatedMarketDepthPlusOnePercentUsdAmount: number
    aggregatedMarketDepthUsdAmount: number
    aggregatedLast7DaysUsdVolume: number
  }
}

// HttpTransport extends base types from endpoint and adds additional, Provider-specific types like 'RequestBody', which is the type of
// request body (not the request to adapter, but the request that adapter sends to Data Provider), and 'ResponseBody' which is
// the type of raw response from Data Provider
export type HttpTransportTypes = BaseEndpointTypes & {
  Provider: {
    RequestBody: never
    ResponseBody: ResponseSchema
  }
}
// HttpTransport is used to fetch and process data from a Provider using HTTP(S) protocol. It usually needs two methods
// `prepareRequests` and `parseResponse`
export const httpTransport = new HttpTransport<HttpTransportTypes>({
  // `prepareRequests` method receives request payloads sent to associated endpoint alongside adapter config(environment variables)
  // and should return 'request information' to the Data Provider. Use this method to construct one or many requests, and the framework
  // will send them to Data Provider
  prepareRequests: (params, config) => {
    return params.map((param) => {
      return {
        params: [param],
        request: {
          baseURL: config.API_ENDPOINT,
          url: 'baseTokenStates/latest',
          headers: {
            'x-api-key': config.API_KEY,
          },
        },
      }
    })
  },
  // `parseResponse` takes the 'params' specified in the `prepareRequests` and the 'response' from Data Provider and should return
  // an array of response objects to be stored in cache. Use this method to construct a list of response objects for every parameter in 'params'
  // and the framework will save them in cache and return to user
  parseResponse: (params, response) => {
    // In case error was received, it's a good practice to return meaningful information to user
    if (!response.data) {
      return params.map((param) => {
        return {
          params: param,
          response: {
            errorMessage: `The data provider didn't return any value for ${param.base}/${param.quote}`,
            statusCode: 502,
          },
        }
      })
    }

    // For successful responses for each 'param' a new response object is created and returned as an array
    return params.map((param) => {
      let result = 0

      Object.values(response.data).forEach((row) => {
        if (row.baseSymbol === param.base && row.quoteSymbol === param.quote) {
          result = Number(row.price)
        }
      })

      return {
        params: param,
        response: {
          result,
          data: {
            result,
          },
        },
      }
    })
  },
})
