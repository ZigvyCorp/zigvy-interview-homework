import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>
{
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ( { label, error, helperText, className = '', ...props }, ref ) =>
    {
        const inputClasses = `input-field ${ error ? 'border-red-500 focus:ring-red-500' : '' } ${ className }`;

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';