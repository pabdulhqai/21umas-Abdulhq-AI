import { useState, useEffect } from 'react';

function useLocalStorageState<T>(
    key: string, 
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            if (state === null || state === undefined) {
                 localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}

export default useLocalStorageState;