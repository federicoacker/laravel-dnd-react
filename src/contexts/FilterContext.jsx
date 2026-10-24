import { createContext} from "react";
import useBackgrounds from "../hooks/useBackgrounds";
import useClasses from "../hooks/useClasses";
import useSpecies from "../hooks/useSpecies";

const FilterContext = createContext(null);

function FilterProvider({ children }) {

    /** VARIABILI DI STATO **/
    const {backgrounds, backgroundError, backgroundPending} = useBackgrounds();
    const {classes, classError, classPending} = useClasses();
    const {species, speciesError, speciesPending} = useSpecies();

    const value = {backgrounds, backgroundError,backgroundPending, classes, classError, classPending, species, speciesError, speciesPending};

    return (
        <FilterContext value={value}>{children}</FilterContext>
    );

}

export {
    FilterProvider,
    FilterContext
}