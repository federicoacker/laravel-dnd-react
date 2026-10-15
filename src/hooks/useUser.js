import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

function useUser() {
    const userValues = useContext(UserContext);

    if(userValues === null){
        throw new Error("User Provider non inserito");
    }

    return userValues;
}

export default useUser