import { apiService } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

export const authService = {
    async login ( credentials: LoginCredentials ): Promise<AuthResponse>
    {
        const response = await apiService.post<AuthResponse>( '/auth/login', credentials );
        return response;
    },

    async register ( credentials: RegisterCredentials ): Promise<AuthResponse>
    {
        const response = await apiService.post<AuthResponse>( '/auth/signup', credentials );
        return response;
    },

    async logout (): Promise<void>
    {
        await apiService.post( '/auth/logout' );
        localStorage.removeItem( 'accessToken' );
        localStorage.removeItem( 'refreshToken' );
    },

    async getCurrentUser (): Promise<User>
    {
        const response = await apiService.get<User>( '/auth/me' );
        return response;
    },

    async refreshToken ( refreshToken: string ): Promise<{ accessToken: string }>
    {
        const response = await apiService.post<{ accessToken: string }>( '/auth/refresh', {
            refreshToken,
        } );
        return response;
    },

    getAccessToken (): string | null
    {
        return localStorage.getItem( 'accessToken' );
    },
};