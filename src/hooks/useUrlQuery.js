import { useState } from "react";
import { useSearchParams } from "react-router"
import useDebounce from "./useDebounce";
import { useEffect } from "react";

function useUrlQuery() {
    const [query, setQuery] = useSearchParams();
    const [debouncedQuery, setSearchTerms, searchTerms] = useDebounce(query.get('search') ? query.get('search') : "", 500);
    const [selectedClassesArray, setSelectedClassesArray] = useState(query.get("classes")?.split(",") ? query.get("classes")?.split(",") : ["any"]);
    const [selectedBackgroundsArray, setSelectedBackgroundsArray] = useState(query.get("backgrounds")?.split(',') ? query.get("backgrounds")?.split(",") : ["any"]);
    const [selectedSpeciesArray, setSelectedSpeciesArray] = useState(query.get("species")?.split(',') ? query.get("species")?.split(',') : ["any"]);


    useEffect(() => {

        setQuery({
            search: debouncedQuery,
            classes: selectedClassesArray.join(","),
            backgrounds: selectedBackgroundsArray.join(","),
            species: selectedSpeciesArray.join(",")
        }
        );

    }, [debouncedQuery, setQuery, selectedClassesArray, selectedBackgroundsArray, selectedSpeciesArray]);

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
        setSelectedSpeciesArray
    };
}


export default useUrlQuery