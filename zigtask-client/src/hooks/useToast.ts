import { useState, useCallback } from 'react';

export interface Toast
{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export const useToast = () =>
{
    const [ toasts, setToasts ] = useState<Toast[]>( [] );

    const addToast = useCallback( ( toast: Omit<Toast, 'id'> ) =>
    {
        const id = Math.random().toString( 36 ).substring( 2, 9 );
        const newToast: Toast = {
            id,
            duration: 5000,
            ...toast,
        };

        setToasts( ( prev ) => [ ...prev, newToast ] );

        if ( newToast.duration )
        {
            setTimeout( () =>
            {
                removeToast( id );
            }, newToast.duration );
        }
    }, [] );

    const removeToast = useCallback( ( id: string ) =>
    {
        setToasts( ( prev ) => prev.filter( ( toast ) => toast.id !== id ) );
    }, [] );

    const toast = {
        success: ( title: string, message?: string ) => addToast( { type: 'success', title, message } ),
        error: ( title: string, message?: string ) => addToast( { type: 'error', title, message } ),
        warning: ( title: string, message?: string ) => addToast( { type: 'warning', title, message } ),
        info: ( title: string, message?: string ) => addToast( { type: 'info', title, message } ),
    };

    return { toasts, addToast, removeToast, toast };
};