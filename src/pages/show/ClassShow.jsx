import { Link, useParams } from "react-router"
import styles from "./ClassShow.module.css"
import useClass from "../../hooks/useClass";
import FeatureShowCard from "../../components/FeatureShowCard";
import { useState } from "react";
import class_icons from "../../utils/data/class_icons";
function ClassShow() {
    const params = useParams();
    const { fetchedClass, classError, classPending } = useClass(params.id)
    const [spellsOpened, setSpellsOpened] = useState(false);
    const proficiencyString = fetchedClass?.proficiencies?.map((proficiency, index, array) => {
        const isLast = index === array.length - 1;
        if (isLast) {
            return `${proficiency.name}`;
        }
        return `${proficiency.name}, `
    });
    return (
        <div className={styles.card}>
            {classPending ? "Loading Class" : !classError ?
                <div>
                    <h1 className="text-center  ">{fetchedClass.name}</h1>
                    <div className="d-flex justify-content-center">
                        <img className={styles.imageIcon} src={class_icons.find(icon => icon.id === fetchedClass.id).image} />
                    </div>
                    <div>
                        <h6>Primary Ability: {fetchedClass.primary_ability}</h6>
                        <h6>Hit Points Die: {fetchedClass.hit_points_die}</h6>
                        <h6>Hit Points At Level 1: {fetchedClass.hit_points_at_level_1}</h6>
                        <h6>Saving Throws: {fetchedClass.saving_throws}</h6>
                        <h6>Armor Training: {fetchedClass.armor_training}</h6>
                        <h6>Starting Equipment: {fetchedClass.starting_equipment}</h6>
                        <h6>Proficiencies: {proficiencyString}</h6>
                        <hr></hr>
                        <p>{fetchedClass.description}</p>
                        <hr></hr>
                        <h5 className="text-center">Features:</h5>
                        <div className={styles.feat}>
                            {fetchedClass.features.map(feature => <FeatureShowCard key={`feature-${feature.id}`} {...feature} />)}
                        </div>
                    </div>
                    {fetchedClass.spells?.length > 0 &&
                        <section className="container" id="spells">
                            <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setSpellsOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${spellsOpened ? styles.buttonOpened : ""}`} type="button">
                                Spells
                            </button>
                            <div className={`${spellsOpened ? "d-block" : "d-none"} ${styles.spellTable}`}>
                                {
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>More Info</th>
                                                <th>Level</th>
                                                <th>Name</th>
                                                <th>Casting Time</th>
                                                <th>Range</th>
                                                <th>Components</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                fetchedClass.spells.sort((a, b) => a.level - b.level).map(spell => {
                                                    return (
                                                        <tr key={`${spell.id}-spell`}>
                                                            <td>
                                                                <Link className={`btn ${styles.actionButton}`} key={`${spell.id}-spell`} to={`/spells/${spell.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Info</Link>
                                                            </td>
                                                            <td>{spell.level}</td>
                                                            <td>{spell.name}</td>
                                                            <td>{spell.casting_time}</td>
                                                            <td>{spell.range}</td>
                                                            <td>{spell.components}</td>
                                                            <td>{spell.duration}</td>

                                                        </tr>

                                                    )
                                                })

                                            }
                                        </tbody>
                                    </table>


                                }
                            </div>
                        </section>
                    }
                </div>
                : classError
            }
        </div>
    )
}

export default ClassShow