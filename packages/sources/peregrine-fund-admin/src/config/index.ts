import { AdapterConfig } from '@chainlink/external-adapter-framework/config'

export const DEFAULT_BASE_URL_VALUE =
  'https://fund-admin-data-adapter-v1-960005989691.europe-west2.run.app'
export const DEFAULT_NAV_URL_VALUE = '/api/v1/nav/'
export const DEFAULT_RESERVE_URL_VALUE = '/api/v1/reserve/'

export const config = new AdapterConfig({
  API_KEY: {
    description: 'An API key for Data Provider',
    type: 'string',
    required: true,
    sensitive: true,
  },
  API_BASE_URL: {
    description: 'Base URL to Fund Admin Server Endpoint',
    type: 'string',
    default: DEFAULT_BASE_URL_VALUE,
  },
  API_NAV_ENDPOINT: {
    description:
      'An API endpoint for the latest Net Asset Value (NAV) calculation for a given asset',
    type: 'string',
    default: DEFAULT_NAV_URL_VALUE,
  },
  API_RESERVE_ENDPOINT: {
    description: 'API Endpoint to get the latest Proof of Reserves for a given asset',
    type: 'string',
    default: DEFAULT_RESERVE_URL_VALUE,
  },
})
