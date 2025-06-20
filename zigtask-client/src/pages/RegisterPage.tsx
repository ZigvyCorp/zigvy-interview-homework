import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { RegisterCredentials } from '../types/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

const registerSchema = yup.object({
  name: yup.string().optional(), // Optional, không gửi lên backend nếu rỗng
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
  try {
    setIsLoading(true);
    // Chỉ gửi đúng các trường backend yêu cầu
    const { email, password, name } = data;
    // Nếu name bị rỗng thì không gửi lên (backend không yêu cầu)
    const payload: { email: string; password: string; name?: string } = { email, password };
    if (name && name.trim() !== '') payload.name = name.trim();
    await registerUser(payload);
    toast.success('Account Created!', 'Welcome to ZigTask! You are now logged in.');
    navigate('/dashboard');
  } catch (error: any) {
    toast.error('Registration Failed', error.message || 'Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                {...register('name')}
                type="text"
                label="Full Name (Tuỳ chọn, không bắt buộc)"
                placeholder="Enter your full name"
                error={errors.name?.message}
                autoComplete="name"
              />
              <Input
                {...register('email')}
                type="email"
                label="Email address"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />
              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Create a password"
                error={errors.password?.message}
                autoComplete="new-password"
              />
              <Input
                {...register('confirmPassword')}
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;