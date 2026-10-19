import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useSpecies() {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [species, setSpecies] = useState([]);
    const [speciesError, setSpeciesError] = useState("");
    const [speciesPending, setSpeciesPending] = useState(true);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/species`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setSpecies(json.data);
                setSpeciesPending(false);
            })
            .catch(error => {
                if(error.message === "404"){
                    setSpeciesError("No species found");
                }
                else{
                    setSpeciesError("There was an error while fetching species");
                }
                setSpeciesPending(false);
            });
    }, [user, baseApiUrl]);

    return {species, speciesError, speciesPending};
}

export default useSpecies