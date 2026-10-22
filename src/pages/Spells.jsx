
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import styles from "./Spells.module.css";
import useDebounce from "../hooks/useDebounce";
import useSpells from "../hooks/useSpells";
import SpellCard from "../components/SpellCard";
import useFilter from "../hooks/useFilter";
import class_icons from "../utils/data/class_icons";


function Spells() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParam = searchParams.get("search") ?? "";
    const [debouncedSearch, setSearch, searchInput] = useDebounce(searchParam, 750);
    let { classes, classError, classPending } = useFilter();
    classes = classes.filter(fetchedClass => fetchedClass.spells.length > 0);
    const selectedClasses = searchParams.get("classes")?.split(",") ?? [];
    const pageParam = searchParams.get("page");
    const parsedPage = Number(pageParam);
    const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const queryParams = new URLSearchParams();
    queryParams.set("paginate", "true");
    queryParams.set("page", String(currentPage));
    if (debouncedSearch.trim()) {
        queryParams.set("search", debouncedSearch.trim());
    }
    if (selectedClasses.length > 0) {
        queryParams.set("classes", selectedClasses.join(","));
    }

    const { spells, spellError, spellPending, lastPage } = useSpells(queryParams.toString());

    useEffect(() => {
        const normalizedSearch = debouncedSearch.trim();
        const searchChanged = searchParam !== normalizedSearch;
        const paginationChanged = searchParams.get("paginate") !== "true" || pageParam !== String(currentPage);

        if (!searchChanged && !paginationChanged) {
            return;
        }

        setSearchParams(current => {
            const next = new URLSearchParams(current);
            next.set("paginate", "true");
            if (searchChanged) {
                if (normalizedSearch) {
                    next.set("search", normalizedSearch);
                } else {
                    next.delete("search");
                }
                next.set("page", "1");
            } else {
                next.set("page", String(currentPage));
            }
            return next;
        }, { replace: true });
    }, [currentPage, debouncedSearch, pageParam, searchParam, searchParams, setSearchParams]);

    const changePage = (page) => {
        setSearchParams(current => {
            const next = new URLSearchParams(current);
            next.set("paginate", "true");
            next.set("page", String(page));
            return next;
        });
    };

    const resetToFirstPage = () => {
        setSearchParams(current => {
            if (!current.has("page") || current.get("page") === "1") {
                return current;
            }

            const next = new URLSearchParams(current);
            next.set("page", "1");
            return next;
        }, { replace: true });
    };

    const changeSearch = (event) => {
        setSearch(event.target.value);
        resetToFirstPage();
    };

    const toggleClass = (className) => {
        setSearchParams(current => {
            const next = new URLSearchParams(current);
            const currentClasses = (next.get("classes") ?? "any")
                .split(",")
                .filter(value => value !== "any");

            if (currentClasses.includes(className)) {
                const updatedClasses = currentClasses.filter(value => value !== className);
                next.set("classes", updatedClasses.length > 0 ? updatedClasses.join(",") : "any");
            } else {
                next.set("classes", [...currentClasses, className].join(","));
            }

            next.set("page", "1");
            next.set("paginate", "true");
            return next;
        });
    };

    return (
        <div className="my-4">
            <div>
                <h2 className="text-white text-center">Spells</h2>
            </div>
            <form className={`form-control ${styles.filterForm}`} data-bs-theme="dark">
                <div className="mb-3" data-bs-theme="dark">
                    <label className="form-label text-white" htmlFor="spell-search">Search spells by name</label>
                    <input
                        className="form-control"
                        id="spell-search"
                        type="search"
                        value={searchInput}
                        onChange={changeSearch}
                    />
                </div>
                <div className="mb-3">
                    <span className="form-label text-white d-block">Filter by class</span>
                    {classError ? <div className={styles.card}>{classError}</div> :
                        classPending ? <div>Loading Classes</div> :
                            <div className="d-flex gap-2 flex-wrap">
                                <button type="button" className="btn btn-outline-primary" onClick={() => {
                                    setSearchParams(current => {
                                        const next = new URLSearchParams(current);
                                        next.set("classes", "any");
                                        next.set("page", "1");
                                        next.set("paginate", "true");
                                        return next;
                                    });
                                }}>Reset Class Filter</button>
                                {classes.map(spellClass =>
                                    <button
                                        key={spellClass.id}
                                        type="button"
                                        className={`btn ${selectedClasses.includes(spellClass.name) ? `d-flex justify-content-center align-items-center flex-column ${styles.btnSelected}` : "d-flex justify-content-center align-items-center flex-column btn-outline-primary"}`}
                                        onClick={() => toggleClass(spellClass.name)}
                                    >
                                        <img className={styles.imageIcon} src={class_icons.find(icon => icon.id === spellClass.id).image} />
                                        <p>{spellClass.name}</p>
                                    </button>
                                )}
                            </div>
                    }
                </div>
            </form>
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || spellPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || spellPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || spellPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={spellPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
            {spellError ? <div className={styles.card}>{spellError}</div> :
                spellPending ? <div className={styles.card}>Loading Spells</div> : spells.length > 0 ?
                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                        {spells.map(spell => <div key={spell.id} className="col"><SpellCard {...spell} /></div>)}
                    </div>
                    : <div className={styles.card}>No Spells Found</div>
            }
            <div className="d-flex justify-content-center align-items-center gap-2 my-4">
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || spellPending} onClick={() => changePage(1)}>First</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage <= 1 || spellPending} onClick={() => changePage(Math.max(1, currentPage - 1))}>Prev</button>
                <span>{currentPage} / {lastPage}</span>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={currentPage >= lastPage || spellPending} onClick={() => changePage(Math.min(lastPage, currentPage + 1))}>Next</button>
                <button className={`btn ${styles.actionButton}`} type="button" disabled={spellPending} onClick={() => changePage(lastPage)}>Last</button>
            </div>
        </div>
    )
}

export default Spells