import { useParams } from "react-router"
import useRace from "../../hooks/useRace"
import styles from "./RaceShow.module.css";
import FeatureShowCard from "../../components/FeatureShowCard";

function RaceShow() {
    const params = useParams();
    const { race, raceError, racePending } = useRace(params.id);
    return (
        <div className={styles.card}>
            {racePending ? "Loading Race" : !raceError ?
                <div>
                    <h1 className="text-center  ">{race.name}</h1>
                    <div>
                        <img className={styles.jumboRaceImage} src={race.image}/>
                        <hr></hr>
                        <p>{race.description}</p>
                        <hr></hr>
                        <h5 className="text-center">Features:</h5>
                        <div className={styles.feat}>
                            {race.features.map(feature => <FeatureShowCard key={`feature-${feature.id}`} {...feature} />)}
                        </div>
                    </div>
                </div>
                : raceError
            }
        </div>
    )
}

export default RaceShow