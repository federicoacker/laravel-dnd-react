import { Link } from "react-router"
import styles from "./ClassCard.module.css"
function ClassCard({ id, name, primary_ability, image, hit_points_die, hit_points_at_level_1, saving_throws, armor_training }) {
    return (
        <Link to={`/classes/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                    {image ?
                        <div className={styles.cardImgWrapper}>
                            <img src={image} alt={`Immagine ${name}`} />
                        </div>
                        :
                        <div className={styles.cardImgWrapper}>
                            <img src="./placeholder.svg" alt={`Immagine Placeholder`} />
                        </div>
                    }
                </section>
                <div className={`my-2 ${styles.cardInfo}`}>
                    <h6 className="px-2 mb-0">Primary Ability Score</h6>
                    <p className="px-2">{primary_ability}</p>
                    <h6 className="px-2 mb-0">Hit Points Die</h6>
                    <p className="px-2">{hit_points_die}</p>
                    <h6 className="px-2 mb-0">Hit Points At Level 1</h6>
                    <p className="px-2">{hit_points_at_level_1}</p>
                    <h6 className="px-2 mb-0">Saving Throws</h6>
                    <p className="px-2">{saving_throws}</p>
                    <h6 className="px-2 mb-0">Armor Training</h6>
                    <p className="px-2">{armor_training}</p>
                </div>
            </div>
        </Link>
    )
}

export default ClassCard