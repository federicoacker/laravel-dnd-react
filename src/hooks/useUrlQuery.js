import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import useDebounce from "./useDebounce";
import { useEffect } from "react";

function useUrlQuery() {
    const [query, setQuery] = useSearchParams();
    const [debouncedQuery, setSearchTerms, searchTerms] = useDebounce(query.get('search') ? query.get('search') : "", 500);
    const [selectedClassesArray, setSelectedClassesArray] = useState(query.get("classes")?.split(",") ? query.get("classes")?.split(",") : ["any"]);
    const [selectedBackgroundsArray, setSelectedBackgroundsArray] = useState(query.get("backgrounds")?.split(',') ? query.get("backgrounds")?.split(",") : ["any"]);
    const [selectedSpeciesArray, setSelectedSpeciesArray] = useState(query.get("species")?.split(',') ? query.get("species")?.split(',') : ["any"]);
    const privatePage = Number(query.get("privatePage") || 1);
    const publicPage = Number(query.get("publicPage") || 1);

    const filters = useMemo(() => ({
        search: searchTerms,
        classes: selectedClassesArray.join(","),
        backgrounds: selectedBackgroundsArray.join(","),
        species: selectedSpeciesArray.join(",")
    }), [searchTerms, selectedClassesArray, selectedSpeciesArray, selectedBackgroundsArray]);

    const [debouncedFilters, setFilterTerms] = useDebounce(filters, 1000);

    useEffect(() => {
        setFilterTerms(filters);
    }, [filters, setFilterTerms]);

    useEffect(() => {
        setQuery(current => ({
            ...Object.fromEntries(current),
            ...debouncedFilters
        }), { replace: true });
    }, [debouncedFilters, setQuery]);

    const setPage = (key, value) => setQuery(current => ({
        ...Object.fromEntries(current),
        [key]: String(typeof value === "function" ? value(Number(current.get(key) || 1)) : value)
    }));

    return {
        debouncedQuery,
        setSelectedClassesArray,
        selectedClassesArray,
        query,
        setSearchTerms,
        searchTerms,
        selectedBackgroundsArray,
        setSelectedBackgroundsArray,
        selectedSpeciesArray,
        setSelectedSpeciesArray,
        privatePage,
        publicPage,
        setPrivatePage: value => setPage("privatePage", value),
        setPublicPage: value => setPage("publicPage", value)
    };
}


export default useUrlQuery