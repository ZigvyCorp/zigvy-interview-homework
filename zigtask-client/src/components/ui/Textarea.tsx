import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
{
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ( { label, error, helperText, className = '', ...props }, ref ) =>
    {
        const textareaClasses = `input-field ${ error ? 'border-red-500 focus:ring-red-500' : '' } ${ className }`;

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    className={textareaClasses}
                    rows={3}
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

Textarea.displayName = 'Textarea';