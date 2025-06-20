import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import
    {
        UserIcon,
        MoonIcon,
        SunIcon,
        ArrowRightOnRectangleIcon
    } from '@heroicons/react/24/outline';

interface HeaderProps
{
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ( { darkMode, toggleDarkMode } ) =>
{
    const { user, logout } = useAuthStore();
    const [ showUserMenu, setShowUserMenu ] = useState( false );

    const handleLogout = async () =>
    {
        await logout();
        setShowUserMenu( false );
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ZigTask
                        </h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu( !showUserMenu )}
                                className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <UserIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                    {user?.name || user?.email}
                                </span>
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu( false )}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                                                <p className="font-medium">{user?.name || 'User'}</p>
                                                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                                            </div>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};