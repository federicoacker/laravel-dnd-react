import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";

function MainLayout() {
    return (
        <>
            <div className="d-flex flex-column vh-100">
            <Header />
                <div className={` ${styles.main} flex-grow-1`}>
                    <main className="container my-4">
                        <Outlet />
                    </main>
                </div>
            <Footer />
            </div>
        </>
    );
}

export default MainLayout;