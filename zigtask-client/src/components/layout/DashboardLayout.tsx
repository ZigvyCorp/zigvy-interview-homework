import React from 'react';
import { Header } from './Header';
import { useDarkMode } from '../../hooks/useDarkMode';

interface DashboardLayoutProps
{
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ( { children } ) =>
{
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};