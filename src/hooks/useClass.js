import { useEffect } from "react";
import { useState } from "react";
import useUser from "./useUser";

function useClass(id) {
   const [fetchedClass, setFetchedClass] = useState({});
    const [classError, setClassError] = useState("");
    const [classPending, setClassPending] = useState(true);
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const { user } = useUser();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClassPending(true);
        setClassError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/classes/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                console.log(json);
                setFetchedClass(json.data);
                setClassPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setClassError("Class not found");
                }
                else {
                    setClassError("There was an error while fetching the class");
                }
                setClassPending(false);
            });
    }, [id, baseApiUrl, user.token]);

    return { fetchedClass, classError, classPending };
}

export default useClass