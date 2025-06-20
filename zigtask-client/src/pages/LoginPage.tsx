import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials } from '../types/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

const loginSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginCredentials) => {
        try {
            setIsLoading(true);
            await login(data);
            toast.success('Welcome back!', 'You have successfully logged in.');
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            console.error('Login error in page:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Please check your credentials and try again.';
            toast.error('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to ZigTask
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit( onSubmit )}>
                    <div className="space-y-4">
                        <Input
                            {...register( 'email' )}
                            type="email"
                            label="Email address"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            autoComplete="email"
                        />

                        <Input
                            {...register( 'password' )}
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            autoComplete="current-password"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;