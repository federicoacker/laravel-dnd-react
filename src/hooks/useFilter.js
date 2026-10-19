import { useContext } from "react"
import { FilterContext } from "../contexts/FilterContext"

function useFilter() {
    const filterValues = useContext(FilterContext);

    if(filterValues === null){
        throw new Error("Filter Provider non inserito");
    }

    return filterValues;
}

export default useFilter