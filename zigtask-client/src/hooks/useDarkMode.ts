import { useState, useEffect } from 'react';

export const useDarkMode = () =>
{
    const [ darkMode, setDarkMode ] = useState( () =>
    {
        const stored = localStorage.getItem( 'darkMode' );
        return stored ? JSON.parse( stored ) : false;
    } );

    useEffect( () =>
    {
        localStorage.setItem( 'darkMode', JSON.stringify( darkMode ) );

        if ( darkMode )
        {
            document.documentElement.classList.add( 'dark' );
        } else
        {
            document.documentElement.classList.remove( 'dark' );
        }
    }, [ darkMode ] );

    const toggleDarkMode = () => setDarkMode( !darkMode );

    return { darkMode, toggleDarkMode };
};