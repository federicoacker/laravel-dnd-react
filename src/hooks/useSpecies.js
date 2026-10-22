import { useEffect, useState } from "react";
import useUser from "./useUser";

function useSpecies(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [species, setSpecies] = useState([]);
    const [speciesError, setSpeciesError] = useState("");
    const [speciesPending, setSpeciesPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSpeciesPending(true);
        setSpeciesError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        const queryString = query ? `?${query}` : "";
        fetch(`${baseApiUrl}/species${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setSpecies(json.data.data);
                if (json.data.last_page) {
                    setLastPage(json.data.last_page);
                }
                setSpeciesPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setSpeciesError("No species found");
                } else {
                    setSpeciesError("There was an error while fetching species");
                }
                setSpeciesPending(false);
            });
    }, [user, baseApiUrl, query]);

    return { species, speciesError, speciesPending, lastPage };
}

export default useSpecies