import class_icons from '../utils/data/class_icons'
import styles from './CharactersCard.module.css'
import { Link } from 'react-router'

function CharactersCard({ id, name, profession, species, background, level, strength, dexterity, constitution, intellect, wisdom, charisma, image }) {
    return (
        <Link to={`/characters/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                    <div className={styles.cardInfo}>

                        <table className={styles.abilityScoresTable}>
                            <tbody>

                                <tr>
                                    <td >
                                        <h5>Strength</h5>
                                        <h5>{strength}</h5>
                                    </td>
                                    <td >
                                        <h5>Dexterity</h5>
                                        <h5>{dexterity}</h5>
                                    </td>
                                    <td >
                                        <h5>Constitution</h5>
                                        <h5>{constitution}</h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td >
                                        <h5>Intellect</h5>
                                        <h5>{intellect}</h5>
                                    </td>
                                    <td >
                                        <h5>Wisdom</h5>
                                        <h5>{wisdom}</h5>
                                    </td>
                                    <td >
                                        <h5>Charisma</h5>
                                        <h5>{charisma}</h5>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.classWrapper}>
                            <img className={styles.imageIcon} src={class_icons.find((icon) => icon.id === profession.id).image} />
                            <p className="text-center mb-0">
                                {profession.name} {level}
                            </p>
                        </div>
                        <div className="d-flex justify-content-center gap-5 mt-4">
                            <div>
                                <h5 className="text-center">Race</h5>
                                <p className="text-center">{species.name}</p>
                            </div>
                            <div>
                                <h5 className="text-center">Background</h5>
                                <p className="text-center">{background.name}</p>
                            </div>
                        </div>


                    </div>
                </section>
            </div>
        </Link>
    )
}

export default CharactersCard