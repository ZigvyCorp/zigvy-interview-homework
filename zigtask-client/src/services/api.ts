import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

class ApiService
{
    private client: AxiosInstance;

    constructor ()
    {
        this.client = axios.create( {
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        } );

        this.setupInterceptors();
    }

    private setupInterceptors ()
    {
        // Request interceptor
        this.client.interceptors.request.use(
            ( config ) =>
            {
                console.log('[API] Request:', {
                    url: config.url,
                    method: config.method,
                    data: config.data,
                    params: config.params,
                });
                
                const token = localStorage.getItem( 'accessToken' );
                if ( token )
                {
                    config.headers.Authorization = `Bearer ${ token }`;
                }
                return config;
            },
            ( error ) =>
            {
                console.error('[API] Request Error:', error);
                return Promise.reject( error );
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            ( response ) =>
            {
                console.log('[API] Response:', {
                    url: response.config.url,
                    status: response.status,
                    data: response.data,
                });
                return response;
            },
            async ( error ) =>
            {
                console.error('[API] Response Error:', error.response || error);
                const originalRequest = error.config;
                if ( error.response?.status === 401 && !originalRequest._retry )
                {
                    originalRequest._retry = true;
                    try
                    {
                        const refreshToken = localStorage.getItem( 'refreshToken' );
                        if ( !refreshToken ) throw new Error( 'No refresh token' );

                        // Assuming authService.refreshToken exists and handles the API call
                        const { accessToken } = await this.refreshToken( refreshToken );

                        localStorage.setItem( 'accessToken', accessToken );
                        originalRequest.headers.Authorization = `Bearer ${ accessToken }`;

                        return this.client( originalRequest );
                    } catch ( refreshError )
                    {
                        console.error('[API] Refresh Token Error:', refreshError);
                        this.handleAuthError();
                        return Promise.reject( refreshError );
                    }
                }
                return Promise.reject( this.handleError( error ) );
            }
        );
    }

    private async refreshToken ( refreshToken: string )
    {
        const response = await this.client.post( '/auth/refresh', {
            refreshToken,
        } );

        const { accessToken } = response.data;
        return { accessToken };
    }

    private handleAuthError ()
    {
        localStorage.removeItem( 'accessToken' );
        localStorage.removeItem( 'refreshToken' );
        window.location.href = '/login';
    }

    private handleError ( error: any ): ApiError
    {
        return {
            message: error.response?.data?.message || error.message || 'An error occurred',
            statusCode: error.response?.status || 500,
            error: error.response?.data?.error,
        };
    }

    async get<T> ( url: string, config?: AxiosRequestConfig ): Promise<T>
    {
        const response = await this.client.get( url, config );
        return response.data;
    }

    async post<T> ( url: string, data?: any, config?: AxiosRequestConfig ): Promise<T>
    {
        const response = await this.client.post( url, data, config );
        return response.data;
    }

    async put<T> ( url: string, data?: any, config?: AxiosRequestConfig ): Promise<T>
    {
        const response = await this.client.put( url, data, config );
        return response.data;
    }

    async delete<T> ( url: string, config?: AxiosRequestConfig ): Promise<T>
    {
        const response = await this.client.delete( url, config );
        return response.data;
    }
}

export const apiService = new ApiService();