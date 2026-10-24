
import CharactersCard from '../components/CharactersCard';
import useCharacters from '../hooks/useCharacters';
import useUser from '../hooks/useUser';
import useUrlQuery from '../hooks/useUrlQuery';
import styles from './Characters.module.css';
import class_icons from '../utils/data/class_icons';
import useFilter from '../hooks/useFilter';
import { Link } from 'react-router';

function Characters() {
    const { user } = useUser();
    const {
        query,
        setSelectedClassesArray,
        selectedClassesArray,
        searchTerms,
        setSearchTerms,
        selectedBackgroundsArray,
        setSelectedBackgroundsArray,
        selectedSpeciesArray,
        setSelectedSpeciesArray,
        privatePage,
        setPrivatePage,
        publicPage,
        setPublicPage
    } = useUrlQuery();
    const { classError, classes, classPending, backgroundError, backgrounds, backgroundPending, species, speciesError, speciesPending } = useFilter()

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
            if (selectedSpecies.includes(speciesValue)) {
                const updatedSpecies = selectedSpecies.filter(value => value !== speciesValue);
                return updatedSpecies.length > 0 ? updatedSpecies : ["any"];
            }

            return [...selectedSpecies, speciesValue];
        })
    }
    const {
        characters: privateCharacters,
        pending: privateCharactersPending,
        error: privateCharactersError,
        lastPage: privateLastPage
    } = useCharacters(`${query}`, user.role === "admin" ? "private" : "mine", privatePage);
    const {
        characters: publicCharacters,
        pending: publicCharactersPending,
        error: publicCharactersError,
        lastPage: publicLastPage
    } = useCharacters(`${query}`, "public", publicPage);

    return (
        <div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">
                <label className="form-label" htmlFor="search"> Search </label>
                <input className="form-control" id="search" name="search" onChange={handleSearchChange} value={searchTerms} type="text" />
                <label className="form-label">Filter by class:</label>
                {
                    classError ? <div>{classError}</div> : !classPending ?
                        <div className="d-flex flex-column align-items-center gap-2">
                            <button type="button" className="btn btn-outline-primary" onClick={() => setSelectedClassesArray(['any'])}>Reset Class Filter</button>
                            <div className="d-flex gap-4 justify-content-center flex-wrap">
                                {
                                    classes.map(fetchedClass => <button type="button" onClick={changeClassArray} data-value={fetchedClass.name} key={fetchedClass.id} className={`btn ${selectedClassesArray.includes(fetchedClass.name) ? styles.btnSelected : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                        <img className={styles.imageIcon} src={class_icons.find(icon => icon.id === fetchedClass.id).image} />
                                        <p>{fetchedClass.name}</p>
                                    </button>)
                                }

                            </div>
                        </div>
                        :
                        <div>
                            "Loading Classes"
                        </div>
                }
                <label className="form-label">Filter by background:</label>
                {
                    backgroundError ? <div>{backgroundError}</div> : !backgroundPending ?
                        <div className="d-flex flex-column align-items-center gap-2">
                            <button type="button" className="btn btn-outline-primary" onClick={() => setSelectedBackgroundsArray(['any'])}>Reset Background Filter</button>
                            <div className="d-flex gap-4 justify-content-center flex-wrap">
                                {
                                    backgrounds.map(fetchedBackground => <button type="button" onClick={changeBackgroundArray} data-value={fetchedBackground.name} key={fetchedBackground.id} className={`btn ${selectedBackgroundsArray.includes(fetchedBackground.name) ? styles.btnSelected : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                        <p>{fetchedBackground.name}</p>
                                    </button>)
                                }

                            </div>
                        </div>
                        :
                        <div>
                            "Loading Backgrounds"
                        </div>
                }
                <label className="form-label">Filter by race:</label>
                {
                    speciesError ? <div>{speciesError}</div> : !speciesPending ?
                        <div className="d-flex flex-column align-items-center gap-2">
                            <button type="button" className="btn btn-outline-primary" onClick={() => setSelectedSpeciesArray(['any'])}>Reset Race Filter</button>
                            <div className="d-flex gap-4 justify-content-center flex-wrap">
                                {
                                    species.map(fetchedSpecies => <button type="button" onClick={changeSpeciesArray} data-value={fetchedSpecies.name} key={fetchedSpecies.id} className={`btn ${selectedSpeciesArray.includes(fetchedSpecies.name) ? styles.btnSelected : 'btn-outline-primary'} d-flex flex-column align-items-center justify-content-center`}>
                                        <p>{fetchedSpecies.name}</p>
                                    </button>)
                                }
                            </div>
                        </div>
                        :
                        <div>
                            "Loading Races"
                        </div>
                }
            </form>

            <div className="my-4">
                {user.role !== "guest" &&
                    <div>
                        <div className="d-flex justify-content-center my-2">
                            <Link className={`btn ${styles.actionButton} `} to="/newCharacter">Create Character</Link>
                        </div>
                        <h2 className="text-white text-center">{user.role === "admin" ? "Private Characters" : "Your Characters"} </h2>
                        {
                            privateCharactersError ? <div className={styles.card}>{privateCharactersError}</div> : !privateCharactersPending && privateCharacters.length > 0 ?
                                <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                                    {privateCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                                </div>
                                : !privateCharactersPending ? <div className={styles.card}>No characters found</div> : <div className={styles.card}>Loading characters</div>
                        }
                        <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                            {
                            // Qui gli passiamo la callback dicendogli cosa deve fare (idem per la public, ma quella sta sotto)
                            }
                            <button className={`btn ${styles.actionButton}`} type="button" disabled={privatePage <= 1 || privateCharactersPending} onClick={() => setPrivatePage(current => Math.max(1, current - 1))}>Prev</button> 
                            <span className="text-white bg-dark d-block rounded-1 px-2">{privatePage} / {privateLastPage}</span>
                            <button className={`btn ${styles.actionButton}`} type="button" disabled={privatePage >= privateLastPage || privateCharactersPending} onClick={() => setPrivatePage(current => Math.min(privateLastPage, current + 1))}>Next</button>
                        </div>
                        <hr className={styles.separator} />
                    </div>
                }
                <h2 className="text-white text-center">Public Characters</h2>
                {
                    publicCharactersError ? <div className={styles.card}>{publicCharactersError}</div> : !publicCharactersPending && publicCharacters.length > 0 ?
                        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                            {publicCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                        </div>
                        : !publicCharactersPending && publicCharacters.length === 0 ? <div className={styles.card}>No characters found</div> : <div className={styles.card}>Loading characters</div>
                }
                <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                    <button className={`btn ${styles.actionButton}`} type="button" disabled={publicPage <= 1 || publicCharactersPending} onClick={() => setPublicPage(current => Math.max(1, current - 1))}>Prev</button>
                    <span className="text-white bg-dark d-block rounded-1 px-2">{publicPage} / {publicLastPage}</span>
                    <button className={`btn ${styles.actionButton}`} type="button" disabled={publicPage >= publicLastPage || publicCharactersPending} onClick={() => setPublicPage(current => Math.min(publicLastPage, current + 1))}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Characters