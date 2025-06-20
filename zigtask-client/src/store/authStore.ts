import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState
{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: ( credentials: LoginCredentials ) => Promise<void>;
    register: ( credentials: RegisterCredentials ) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        ( set, get ) => ( {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async ( credentials: LoginCredentials ) =>
            {
                try
                {
                    set( { isLoading: true, error: null } );

                    const { user, accessToken, refreshToken } = await authService.login( credentials );

                    localStorage.setItem( 'accessToken', accessToken );
                    if ( refreshToken ) {
                        localStorage.setItem( 'refreshToken', refreshToken );
                    }

                    set( {
                        user: user,
                        isAuthenticated: true,
                        isLoading: false,
                    } );

                    // No need to return response here, as it's handled by the store state
                } catch ( error: any )
                {
                    set( {
                        error: error.response?.data?.message || error.message || 'Login failed',
                        isLoading: false,
                        isAuthenticated: false,
                    } );
                    throw error;
                }
            },

            register: async ( credentials: RegisterCredentials ) => {
    try {
        set({ isLoading: true, error: null });

        const response = await authService.register(credentials);

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
        });

        // Gọi getCurrentUser để xác thực accessToken mới đăng ký
        try {
            await get().getCurrentUser();
        } catch (err) {
            // Nếu lỗi, tự động logout để tránh vòng lặp refresh token
            await get().logout();
            set({ error: 'Phiên đăng ký không hợp lệ, vui lòng đăng nhập lại!', isLoading: false, isAuthenticated: false });
            throw err;
        }
    } catch (error: any) {
        set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
        });
        throw error;
    }
},

            logout: async () =>
            {
                try
                {
                    await authService.logout();
                } catch ( error )
                {
                    console.error( 'Logout error:', error );
                } finally
                {
                    set( {
                        user: null,
                        isAuthenticated: false,
                        error: null,
                    } );
                }
            },

            getCurrentUser: async () =>
            {
                try
                {
                    const token = localStorage.getItem( 'accessToken' );
                    if ( !token ) return;

                    set( { isLoading: true } );
                    const user = await authService.getCurrentUser();

                    set( {
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    } );
                } catch ( error: any )
                {
                    set( {
                        error: error.message,
                        isLoading: false,
                        isAuthenticated: false,
                    } );
                    localStorage.removeItem( 'accessToken' );
                    localStorage.removeItem( 'refreshToken' );
                }
            },

            clearError: () => set( { error: null } ),
        } ),
        {
            name: 'auth-store',
            partialize: ( state ) => ( {
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            } ),
        }
    )
);