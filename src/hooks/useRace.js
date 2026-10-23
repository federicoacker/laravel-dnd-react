import { useEffect, useState } from "react";
import useUser from "./useUser";

function useRace(id) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [race, setRace] = useState([]);
    const [raceError, setRaceError] = useState("");
    const [racePending, setRacePending] = useState(true);


    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRacePending(true);
        setRaceError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
    
        fetch(`${baseApiUrl}/species/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setRace(json.data);
                setRacePending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setRaceError("Race not found");
                } else {
                    setRaceError("There was an error while fetching species");
                }
                setRacePending(false);
            });
    }, [user, baseApiUrl, id]);

    return { race, raceError, racePending };
}

export default useRace