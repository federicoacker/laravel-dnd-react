import useSpell from "../../hooks/useSpell";
import class_icons from "../../utils/data/class_icons";
import styles from "./SpellShow.module.css";
import { Link, useParams } from "react-router";
function SpellShow() {
    const params = useParams();
    const { spell, spellError, spellPending } = useSpell(params.id);
    const classString = spell?.professions?.map((profession) => {
        return <Link key={`class-${profession.id}`} to={`/classes/${profession.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="d-flex flex-column align-items-center">
            <img className={styles.imageIcon} src={class_icons.find(icon => icon.id === profession.id).image}></img>
            {profession.name}
        </div>
        </Link>
    });

    return (
        <div className={styles.card}>
            {spellPending ? "Loading Spell" : !spellError ?
                <div>
                    <h1 className="text-center  ">{spell.name}</h1>
                    <div>
                        <h6>Level: {spell.level === 0 ? "Cantrip" : spell.level}</h6>
                        <h6>Casting Time: {spell.casting_time}</h6>
                        <h6>Range: {spell.range}</h6>
                        <h6>Components: {spell.components}</h6>
                        <h6>Duration: {spell.duration}</h6>
                    </div>
                    <div>
                        <hr></hr>
                        <p dangerouslySetInnerHTML={{ __html: spell.description }} />
                        <hr></hr>
                    </div>
                    <div>
                        <h5>Classes:</h5>
                        <div className='d-flex gap-2'>
                            {classString}
                        </div>
                    </div>
                </div>
                : spellError
            }
        </div>
    )
}

export default SpellShow