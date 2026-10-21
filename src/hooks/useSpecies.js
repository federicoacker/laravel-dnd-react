import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useSpecies(paginate = false) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [species, setSpecies] = useState([]);
    const [speciesError, setSpeciesError] = useState("");
    const [speciesPending, setSpeciesPending] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/species?paginate=${paginate}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setSpecies(json.data.data);
                if(json.data.current_page){
                    setCurrentPage(json.data.currentPage);
                }
                if(json.data.last_page){
                    setLastPage(json.data.lastPage);
                }
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
    }, [user, baseApiUrl, paginate]);

    return {species, speciesError, speciesPending, currentPage, lastPage};
}

export default useSpecies