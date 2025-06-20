import React, { forwardRef } from 'react';

interface SelectOption
{
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>
{
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ( { label, error, options, placeholder, className = '', ...props }, ref ) =>
    {
        const selectClasses = `input-field ${ error ? 'border-red-500 focus:ring-red-500' : '' } ${ className }`;

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <select ref={ref} className={selectClasses} {...props}>
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map( ( option ) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ) )}
                </select>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';