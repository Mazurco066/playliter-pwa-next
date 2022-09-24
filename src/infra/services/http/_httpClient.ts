// Dependencies
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { asyncRequestHandler } from 'presentation/utils'

// Types
import type { APIResponse } from 'domain/types'

// Fetch error class
export class FetchError extends Error {
  response: Response
  data: {
    message: string
  }
  constructor({
    message,
    response,
    data,
  }: {
    message: string
    response: Response
    data: {
      message: string
    }
  }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError)
    }

    this.name = 'FetchError'
    this.response = response
    this.data = data ?? { message: message }
  }
}

// Fetch method
export async function requestApi(
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete', 
  body?: {} | undefined,
  config?: AxiosRequestConfig<{}> | undefined
): Promise<AxiosResponse<any, APIResponse>> {

  // Retrieve base url
  const baseUrl: string = process.env.API_BASE_URL || '' as string
  const requestUrl = `${baseUrl}${url}`

  // Using axios to request async
  const response = await asyncRequestHandler(
    ['post', 'put', 'patch'].includes(method)
      ? axios[method](requestUrl, body, config)
      : axios[method](requestUrl, config)
  )

  // Return api response
  return response
}

// Fetch Nextjs api
export async function requestClient(
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete', 
  body?: {} | undefined,
  config?: AxiosRequestConfig<{}> | undefined
): Promise<AxiosResponse<any, APIResponse>> {

  // Retrieve base url
  const baseUrl: string = location.origin as string
  const requestUrl = `${baseUrl}${url}`
  
  // Using axios to request async
  const response = await asyncRequestHandler(
    ['post', 'put', 'patch'].includes(method)
      ? axios[method](requestUrl, body, config)
      : axios[method](requestUrl, config)
  )

  // Return api response
  return response
}
