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
        setQuery(current => {
            const filtersChanged =
                (current.get("search") ?? "") !== debouncedFilters.search ||
                (current.get("classes") ?? "any") !== debouncedFilters.classes ||
                (current.get("backgrounds") ?? "any") !== debouncedFilters.backgrounds ||
                (current.get("species") ?? "any") !== debouncedFilters.species;

            const next = new URLSearchParams(current);

            Object.entries(debouncedFilters).forEach(([key, value]) => {
                next.set(key, value);
            });

            if (filtersChanged) {
                next.set("privatePage", "1");
                next.set("publicPage", "1");
                if (current.has("page")) {
                    next.set("page", "1");
                }
            }

            return next;
        }, { replace: true });
    }, [debouncedFilters, setQuery]);


    //Inversione di controllo, la setPage riceve una callback e la esegue e usa quel risultato per salvare la key della pagina (che ha ricevuto dalla funzione)
    const setPage = (key, value) => setQuery(current => ({
        ...Object.fromEntries(current),
        [key]: String(typeof value === "function" ? value(Number(current.get(key) || 1)) : value)
    }));

    return {
        debouncedQuery,
        setQuery,
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
        setPrivatePage: value => setPage("privatePage", value), // Creiamo delle callback di base per settare privatePage e publicPage che ci serviranno per i Characters
        setPublicPage: value => setPage("publicPage", value)    // questi metteranno come key la stringa e come value, qualsiasi cosa gli passo, noi gli passeremo delle callback
    };                                                          // dai pulsanti next e prev
}


export default useUrlQuery