import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";

function MainLayout() {
    const location = useLocation();
    const currentPath = location.pathname;
    let pageModifier = "index";

    switch(currentPath){
        case "/":
            pageModifier = "index";
            break;
        case "/characters":
            pageModifier = "characters";
            break;
        default:
            pageModifier = "index";
            break;
    }
    
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