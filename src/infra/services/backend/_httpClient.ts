// Dependencies
import axios, { AxiosInstance } from 'axios'

// Base http client
const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL
})

// Exporting http client
export default httpClient
