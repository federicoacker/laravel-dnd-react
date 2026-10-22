
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import ProficiencyCard from "../components/ProficiencyCard";
import styles from "./Proficiencies.module.css";
import useDebounce from "../hooks/useDebounce";
import useProficiencies from "../hooks/useProficiencies";


function Proficiencies() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const parsedPage = Number(pageParam);
    const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const search = searchParams.get("search") ?? "";
    const [debouncedSearch, setSearch, searchInput] = useDebounce(search, 750);

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("paginate", "true");
    queryParams.set("page", String(currentPage));

    const { proficiencies, proficiencyError, proficiencyPending, lastPage } = useProficiencies(queryParams.toString());

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
                <h2 className="text-white text-center">Proficiencies</h2>
            </div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">

                <div className="mb-3">
                    <label className="form-label text-white" htmlFor="proficiency-search">Search proficiencies by name</label>
                    <input
                        className="form-control"
                        id="proficiency-search"
                        type="search"
                        value={searchInput}
                        onChange={event => setSearch(event.target.value)}
                    />
                </div>
            </form>
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || proficiencyPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || proficiencyPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || proficiencyPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={proficiencyPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
            {proficiencyError ? <div className={styles.card}>{proficiencyError}</div> :
                proficiencyPending ? <div className={styles.card}>Loading Proficiencies</div> : proficiencies.length > 0 ? 
                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                        {proficiencies.map(proficiency => <div key={proficiency.id} className="col"><ProficiencyCard {...proficiency} /></div>)}
                    </div>
                    : <div className={styles.card}>No Proficiencies Found</div>
            }

            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || proficiencyPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || proficiencyPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || proficiencyPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={proficiencyPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
        </div>
    )
}

export default Proficiencies