
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import useSpecies from "../hooks/useSpecies"
import RaceCard from "../components/RaceCard";
import styles from "./Races.module.css";
import useDebounce from "../hooks/useDebounce";


function Races() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const parsedPage = Number(pageParam);
    const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const search = searchParams.get("search") ?? "";
    const [debouncedSearch, setSearch, searchInput] = useDebounce(search, 750);

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("paginate", "true");
    queryParams.set("page", String(currentPage));

    const { species, speciesError, speciesPending, lastPage } = useSpecies(queryParams.toString());

    useEffect(() => {
        const searchChanged = debouncedSearch !== search;
        const paginationChanged = searchParams.get("paginate") !== "true" || pageParam !== String(currentPage);

        if (!searchChanged && !paginationChanged) {
            return;
        }

        setSearchParams(current => {
            const next = new URLSearchParams(current);
            next.set("paginate", "true");
            if (searchChanged) {
                if (debouncedSearch) {
                    next.set("search", debouncedSearch);
                } else {
                    next.delete("search");
                }
                next.set("page", "1");
            } else {
                next.set("page", String(currentPage));
            }
            return next;
        }, { replace: true });
    }, [currentPage, debouncedSearch, pageParam, search, searchParams, setSearchParams]);

    useEffect(() => {
        setSearch(search);
    }, [search, setSearch]);

    function changePage(page) {
        setSearchParams(current => {
            const next = new URLSearchParams(current);
            next.set("paginate", "true");
            next.set("page", String(page));
            return next;
        });
    }

    return (
        <div className="my-4">
            <div>
                <h2 className="text-white text-center">Races</h2>
            </div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">
                <div className="mb-3">
                    <label className="form-label text-white" htmlFor="races-search">Search races by name</label>
                    <input
                        className="form-control"
                        id="races-search"
                        type="search"
                        value={searchInput}
                        onChange={event => setSearch(event.target.value)}
                    />
                </div>
            </form>
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || speciesPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || speciesPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || speciesPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={speciesPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
            {speciesError ? <div className={styles.card}>{speciesError}</div> :
                speciesPending ? <div className={styles.card}>Loading Races</div> : species.length > 0 ?
                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                        {species.map(race => <div key={race.id} className="col"><RaceCard {...race} /></div>)}
                    </div> 
                    : <div className={styles.card}>No Races Found</div>
            }
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || speciesPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || speciesPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || speciesPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={speciesPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
        </div>
    )
}

export default Races