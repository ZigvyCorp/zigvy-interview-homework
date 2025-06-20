import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Toast } from '../../hooks/useToast';

interface ToastContainerProps
{
    toasts: Toast[];
    removeToast: ( id: string ) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ( { toasts, removeToast } ) =>
{
    const getIcon = ( type: Toast[ 'type' ] ) =>
    {
        const iconProps = { className: 'h-6 w-6 flex-shrink-0' };

        switch ( type )
        {
            case 'success':
                return <CheckCircleIcon {...iconProps} className="h-6 w-6 text-green-400" />;
            case 'error':
                return <XCircleIcon {...iconProps} className="h-6 w-6 text-red-400" />;
            case 'warning':
                return <ExclamationTriangleIcon {...iconProps} className="h-6 w-6 text-yellow-400" />;
            case 'info':
                return <InformationCircleIcon {...iconProps} className="h-6 w-6 text-blue-400" />;
            default:
                return <InformationCircleIcon {...iconProps} className="h-6 w-6 text-blue-400" />;
        }
    };

    const getToastClasses = ( type: Toast[ 'type' ] ) =>
    {
        const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5';

        switch ( type )
        {
            case 'success':
                return `${ baseClasses } border-l-4 border-green-400`;
            case 'error':
                return `${ baseClasses } border-l-4 border-red-400`;
            case 'warning':
                return `${ baseClasses } border-l-4 border-yellow-400`;
            case 'info':
                return `${ baseClasses } border-l-4 border-blue-400`;
            default:
                return `${ baseClasses } border-l-4 border-blue-400`;
        }
    };

    if ( toasts.length === 0 ) return null;

    return (
        <div className="fixed top-0 right-0 z-50 p-6 space-y-4">
            {toasts.map( ( toast ) => (
                <div
                    key={toast.id}
                    className={`${ getToastClasses( toast.type ) } transform transition-all duration-300 ease-in-out`}
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getIcon( toast.type )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                                {toast.message && (
                                    <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                                )}
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={() => removeToast( toast.id )}
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) )}
        </div>
    );
};