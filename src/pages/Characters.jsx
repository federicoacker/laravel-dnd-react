
import CharactersCard from '../components/CharactersCard';
import useCharacters from '../hooks/useCharacters';
import useUser from '../hooks/useUser';
import useUrlQuery from '../hooks/useUrlQuery';
import styles from './Characters.module.css';
import class_icons from '../utils/data/class_icons';
import useFilter from '../hooks/useFilter';

function Characters() {
    const { user } = useUser();
    const { debouncedQuery, setSelectedClassesArray, selectedClassesArray, searchTerms, setSearchTerms, selectedBackgroundsArray, setSelectedBackgroundsArray, selectedSpeciesArray, setSelectedSpeciesArray } = useUrlQuery();
    const { classError, classes, classPending, backgroundError, backgrounds, backgroundPending, species, speciesError, speciesPending } = useFilter()
    const { error, characters, pending } = useCharacters(`?search=${debouncedQuery}&classes=${selectedClassesArray.join(",")}&backgrounds=${selectedBackgroundsArray.join(",")}&species=${selectedSpeciesArray.join(",")}`);

    const handleSearchChange = (event) => {
        setSearchTerms(event.target.value);
    }

    const changeClassArray = (event) => {
        const classValue = event.currentTarget.dataset.value;

        setSelectedClassesArray(currentClasses => {
            const selectedClasses = currentClasses.filter(value => value !== 'any');

            if (selectedClasses.includes(classValue)) {
                const updatedClasses = selectedClasses.filter(value => value !== classValue);
                return updatedClasses.length > 0 ? updatedClasses : ['any'];
            }

            return [...selectedClasses, classValue];
        });
    }

    const changeBackgroundArray = (event) => {
        const backgroundValue = event.currentTarget.dataset.value;

        setSelectedBackgroundsArray(currentBackgrounds => {
            const selectedBackgrounds = currentBackgrounds.filter(value => value !== "any");
            if (selectedBackgrounds.includes(backgroundValue)) {
                const updatedBackgrounds = selectedBackgrounds.filter(value => value !== backgroundValue);
                return updatedBackgrounds.length > 0 ? updatedBackgrounds : ["any"];
            }

            return [...selectedBackgrounds, backgroundValue];
        })
    }

    const changeSpeciesArray = (event) => {
        const speciesValue = event.currentTarget.dataset.value;

        setSelectedSpeciesArray(currentSpecies => {
            const selectedSpecies = currentSpecies.filter(value => value !== "any");
            if(selectedSpecies.includes(speciesValue)){
                const updatedSpecies = selectedSpecies.filter(value => value !== speciesValue);
                return updatedSpecies.length > 0 ? updatedSpecies : ["any"];
            }

            return [...selectedSpecies, speciesValue];
        })
    }

    const priCharacters = characters.filter(character => !character.is_public);
    const pubCharacters = characters.filter(character => character.is_public);

    return (
        <div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">
                <label className="form-label" htmlFor="search"> Search </label>
                <input className="form-control" id="search" name="search" onChange={handleSearchChange} value={searchTerms} type="text" />
                <label className="form-label">Filter by class:</label>
                {
                    classError ? <div>{classError}</div> : !classPending ?

                        <div className="d-flex gap-4 justify-content-center flex-wrap">
                            {
                                classes.map(fetchedClass => <button type="button" onClick={changeClassArray} data-value={fetchedClass.name} key={fetchedClass.id} className={`btn ${selectedClassesArray.includes(fetchedClass.name) ? 'btn-primary' : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                    <img className={styles.imageIcon} src={class_icons.find(icon => icon.id === fetchedClass.id).image} />
                                    <p>{fetchedClass.name}</p>
                                </button>)
                            }
                        </div>
                        :
                        <div>
                            "Stiamo caricando le classi"
                        </div>
                }
                <label className="form-label">Filter by background:</label>
                {
                    backgroundError ? <div>{backgroundError}</div> : !backgroundPending ?

                        <div className="d-flex gap-4 justify-content-center flex-wrap">
                            {
                                backgrounds.map(fetchedBackground => <button type="button" onClick={changeBackgroundArray} data-value={fetchedBackground.name} key={fetchedBackground.id} className={`btn ${selectedBackgroundsArray.includes(fetchedBackground.name) ? 'btn-primary' : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                    <p>{fetchedBackground.name}</p>
                                </button>)
                            }
                        </div>
                        :
                        <div>
                            "Stiamo caricando i backgrounds"
                        </div>
                }
                <label className="form-label">Filter by race:</label>
                {
                    speciesError ? <div>{speciesError}</div> : !speciesPending ?

                        <div className="d-flex gap-4 justify-content-center flex-wrap">
                            {
                                species.map(fetchedSpecies => <button type="button" onClick={changeSpeciesArray} data-value={fetchedSpecies.name} key={fetchedSpecies.id} className={`btn ${selectedSpeciesArray.includes(fetchedSpecies.name) ? 'btn-primary' : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                    <p>{fetchedSpecies.name}</p>
                                </button>)
                            }
                        </div>
                        :
                        <div>
                            "Stiamo caricando le races"
                        </div>
                }
            </form>

            <div className="my-4">
                {user.role !== "guest" &&
                    <div>
                        <h2 className="text-white text-center">{user.role === "admin" ? "Personaggi Privati" : "I tuoi Personaggi"} </h2>
                        {
                            error ? <div>{error}</div> : !pending && priCharacters.length > 0 ?
                                <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                                    {priCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                                </div>
                                : !pending && priCharacters.length === 0 ? "Non sono stati trovati personaggi" : "Stiamo caricando i personaggi"
                        }
                        <hr className={styles.separator} />
                    </div>
                }
                <h2 className="text-white text-center">Personaggi Pubblici</h2>
                {
                    error ? <div>{error}</div> : !pending && pubCharacters.length > 0 ?
                        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                            {pubCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                        </div>
                        : !pending && pubCharacters.length === 0 ? "Non sono stati trovati personaggi" : "Stiamo caricando i personaggi"
                }
            </div>
        </div>
    )
}

export default Characters