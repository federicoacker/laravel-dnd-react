import { useState, useEffect } from "react";

function useDebounce(initialValue, delay) {

    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const debouncerTimerID = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(debouncerTimerID);
        };
    }, [delay, value]);

    return [debouncedValue, setValue, value];
}

export default useDebounce;