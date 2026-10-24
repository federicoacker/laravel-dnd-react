import { Link } from "react-router";
import useUser from "../hooks/useUser";
import styles from "./HomePage.module.css";

function HomePage() {
  const { user } = useUser();
  const isLoggedIn = user?.token;

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Your next adventure starts here</p>
        <h1 id="home-title" className={styles.title}>
          Forge a hero
          <span> worthy of legend.</span>
        </h1>
        <p className={styles.intro}>
          Character Forge brings the building blocks of your next tabletop
          adventure together. Shape a character, explore races and classes, and
          find the spells and features that make your hero yours.
        </p>
        <div className={styles.actions}>
          <Link
            className={styles.primaryAction}
            to={isLoggedIn ? "/newCharacter" : "/login"}
          >
            {isLoggedIn ? "Create your character" : "Log in to get started"}
            <span >→</span>
          </Link>
          {!isLoggedIn && (
            <Link className={styles.secondaryAction} to="/register">
              Create an account
            </Link>
          )}
        </div>
      </section>

      <section className={styles.discover}>
        <h2 id="discover-title" className={styles.discoverTitle}>
          Everything you need to begin
        </h2>
        <div className={styles.exploreLinks}>
          <Link className={styles.exploreLink} to="/races">
            <span className={styles.linkNumber}>01</span>
            <span>
              <strong>Choose your lineage</strong>
              <span className={styles.linkDescription}>
                Discover the many playable races.
              </span>
            </span>
            <span className={styles.linkArrow} >↗</span>
          </Link>
          <Link className={styles.exploreLink} to="/classes">
            <span className={styles.linkNumber}>02</span>
            <span>
              <strong>Find your calling</strong>
              <span className={styles.linkDescription}>
                Explore classes and their features.
              </span>
            </span>
            <span className={styles.linkArrow} >↗</span>
          </Link>
          <Link className={styles.exploreLink} to="/spells">
            <span className={styles.linkNumber}>03</span>
            <span>
              <strong>Master the arcane</strong>
              <span className={styles.linkDescription}>
                Browse spells for your next adventure.
              </span>
            </span>
            <span className={styles.linkArrow} >↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
