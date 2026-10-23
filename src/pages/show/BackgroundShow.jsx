import { useParams } from "react-router"
import useBackground from "../../hooks/useBackground"
import styles from "./BackgroundShow.module.css"
function BackgroundShow() {
    const params = useParams();
    const { background, backgroundError, backgroundPending } = useBackground(params.id)
    const proficiencyString = background?.proficiencies?.map((proficiency, index, array)=>{
        const isLast = index === array.length-1;
        if(isLast){
            return `${proficiency.name}`;
        }
        return `${proficiency.name}, `
    });
    return (
        <div className={styles.card}>
            {backgroundPending ? "Loading Background" : !backgroundError ?
            <div>
            <h1 className="text-center  ">{background.name}</h1>
            <div>
                <h6>Ability Scores: {background.ability_scores}</h6>
                <h6>Starting Equipment: {background.equipment}</h6>
                <h6>Proficiencies: {proficiencyString}</h6>
                <hr></hr>
                <p>{background.description}</p>
                <hr></hr>
                <h5 className="text-center">Feat:</h5>
                <div className={styles.feat}>
                    <h6>{background.feat.name}</h6>
                    <p dangerouslySetInnerHTML={{ __html: background.feat.description }}></p>
                </div>
            </div>
            </div>
            : backgroundError
            }
        </div>
    )
}

export default BackgroundShow