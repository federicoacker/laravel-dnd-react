
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import styles from "./Classes.module.css";
import useClasses from "../hooks/useClasses";
import ClassCard from "../components/ClassCard";
import useDebounce from "../hooks/useDebounce";


function Classes() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const parsedPage = Number(pageParam);
    const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const search = searchParams.get("search") ?? "";
    const [debouncedSearch, setSearch, searchInput] = useDebounce(search, 750);

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("paginate", "true");
    queryParams.set("page", String(currentPage));

    const { classes, classError, classPending, lastPage } = useClasses(queryParams.toString());

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
                <h2 className="text-white text-center">Classes</h2>
            </div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">
                <div className="mb-3">
                    <label className="form-label text-white" htmlFor="class-search">Search classes by name</label>
                    <input
                        className="form-control"
                        id="class-search"
                        type="search"
                        value={searchInput}
                        onChange={event => setSearch(event.target.value)}
                    />
                </div>
            </form>
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || classPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || classPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span className="text-white bg-dark d-block rounded-1 px-2">{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || classPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={classPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
            {classError ? <div className={styles.card}>{classError}</div> :
                classPending ? <div className={styles.card}>Loading Classes</div> : classes.length > 0 ?
                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                        {classes.map(fetchedClass => <div key={fetchedClass.id} className="col"><ClassCard {...fetchedClass} /></div>)}
                    </div>
                    : <div className={styles.card}>No Classes Found</div>
            }
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || classPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || classPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span className="text-white bg-dark d-block rounded-1 px-2">{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || classPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={classPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
        </div>
    )
}

export default Classes