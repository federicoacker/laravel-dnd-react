import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";
import validator from "../utils/functions/mapper";

function MainLayout() {
    const location = useLocation();
    const currentPath = location.pathname;
    let pageModifier = validator(currentPath, "index");
    return (
        <>
            <div className="d-flex flex-column vh-100">
                <Header />
                <div className={` ${styles.main} ${styles[pageModifier]} flex-grow-1`}>
                    <main className="container">
                        <Outlet />
                    </main>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default MainLayout;