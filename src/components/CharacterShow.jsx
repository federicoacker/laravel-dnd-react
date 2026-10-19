import { useState } from "react";
import useProficiencies from "../hooks/useProficiencies"
import styles from "./CharacterShow.module.css"
import useClasses from "../hooks/useClasses";
import useBackgrounds from "../hooks/useBackgrounds";
import useSpecies from "../hooks/useSpecies";
import useUser from "../hooks/useUser";
import useFeats from "../hooks/useFeats";
import validateCharacterEdit from "../utils/functions/validateCharacterEdit";

function CharacterShow({ id, owner_id, name, level, background, backstory, strength, dexterity, constitution, intellect, wisdom, charisma, image, inventory, profession, species, proficiencies, feats }) {
    const { proficiencyError, proficiencyPending, proficiencies: fetchedProficiencies } = useProficiencies();
    const [backstoryOpened, setBackstoryOpened] = useState(false);
    const [classFeaturesOpened, setClassFeaturesOpened] = useState(false);
    const [speciesFeaturesOpened, setSpeciesFeaturesOpened] = useState(false);
    const [featsOpened, setFeatsOpened] = useState(false);
    const [spellsOpened, setSpellsOpened] = useState(false);
    const [inventoryOpened, setInventoryOpened] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const { user: currentUser } = useUser();
    const templateErrors = {
        id: "",
        name: "",
        level: "",
        background: "",
        backstory: "",
        strength: "",
        dexterity: "",
        constitution: "",
        intellect: "",
        wisdom: "",
        charisma: "",
        inventory: "",
        profession: "",
        species: "",
        proficiencies: "",
        feats: ""
    };
    const [validationErrors, setValidationErrors] = useState(templateErrors);

    const hasPermission = currentUser.role === "admin" || (currentUser.role === "user" && owner_id === currentUser.id);

    const { classes, classPending, classError } = useClasses();
    const { backgrounds, backgroundPending, backgroundError } = useBackgrounds();
    const { species: races, racePending, raceError } = useSpecies();
    const { feats: fetchedFeats, featPending, featError } = useFeats();

    const readyToEdit = hasPermission && !classPending && !classError && !backgroundPending && !backgroundError && !racePending && !raceError && !featPending && !featError;

    const [updatedCharacter, setUpdatedCharacter] = useState({
        id,
        name,
        level,
        background,
        backstory,
        strength,
        dexterity,
        constitution,
        intellect,
        wisdom,
        charisma,
        image,
        inventory,
        profession,
        species,
        proficiencies,
        feats,
        owner_id
    });
    const [updatedAbilityScores, setUpdatedAbilityScores] = useState({
        strength,
        dexterity,
        constitution,
        intellect,
        wisdom,
        charisma
    });

    const numberOfFeats = Math.floor(updatedCharacter.level / 4);
    const selectableFeats = fetchedFeats.filter(feat => feat.id !== updatedCharacter.background.feat.id);

    const handleAbilityScoreEdit = (event) => {
        const score = event.target.name;
        const value = event.target.value;

        setUpdatedAbilityScores({
            ...updatedAbilityScores,
            [score]: Number(value)
        });
        setUpdatedCharacter((current) => { return { ...current, [score]: Number(value) } })
    }

    const [featList, setFeatList] = useState(updatedCharacter.feats);

    const handleEdit = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        const type = event.target.type;

        if (type === "checkbox" && field !== "feats") {
            let newProficiencies = updatedCharacter.proficiencies.map(proficiency => { return { name: proficiency.name, id: proficiency.id } });
            if (newProficiencies.map(proficiency => proficiency.id).includes(Number(value))) {
                newProficiencies = newProficiencies.filter(proficiency => proficiency.id !== Number(value));
            }
            else {
                newProficiencies.push({ name: field, id: Number(value) });
            }
            console.log(newProficiencies);

            setUpdatedCharacter(
                {
                    ...updatedCharacter,
                    proficiencies: newProficiencies
                }
            );
            return;

        }
        else if (field === "profession") {

            setUpdatedCharacter(
                {
                    ...updatedCharacter,
                    profession: classes.find(profession => profession.id === Number(value))
                }
            )
            return;
        }
        else if (field === "species") {

            setUpdatedCharacter(
                {
                    ...updatedCharacter,
                    species: races.find(race => race.id === Number(value))
                }
            )
            return;
        }
        else if (field === "background") {
            const newBackground = backgrounds.find(background => background.id === Number(value))
            const newFeats = updatedCharacter.feats.filter(feat => feat.id !== updatedCharacter.background.feat.id);
            newFeats.push(newBackground.feat);
            setFeatList(newFeats);
            setUpdatedCharacter(
                {
                    ...updatedCharacter,
                    background: newBackground,
                    feats: newFeats
                }
            )
            return;
        }
        else if (field === "image") {
            const file = event.target.files[0];
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
                setUpdatedCharacter(
                    {
                        ...updatedCharacter,
                        image: file
                    }
                );
            }
            return;
        }
        else if (type === "checkbox" && field === "feats") {
            let featIds = featList.map(feat => feat.id);
            if (featIds.includes(Number(value))) {
                featIds = featIds.filter(featId => featId !== Number(value));
            }
            else {
                featIds.push(Number(value));
            }
            const recoveredFeats = fetchedFeats.filter(feat => featIds.includes(feat.id));

            setFeatList(recoveredFeats);

            setUpdatedCharacter((current) => {
                return { ...current, feats: recoveredFeats }
            })
            return;
        }
        setUpdatedCharacter(
            {
                ...updatedCharacter,
                [field]: value
            }
        )
    }

    const skillProficiencies = fetchedProficiencies.filter(proficiency => proficiency.type === "Skill");
    const toolProficiencies = proficiencies.filter(proficiency => proficiency.type === "Tool" || proficiency.type === "Musical Instrument");
    const weaponProficiencies = profession.proficiencies.filter(proficiency => proficiency.type === "Weapon");
    const allToolProficiencies = fetchedProficiencies.filter(proficiency => proficiency.type === "Tool" || proficiency.type === "Musical Instrument");
    let proficiencyBonus;

    if (updatedCharacter.level <= 4) {
        proficiencyBonus = 2;
    } else if (updatedCharacter.level > 4 && level <= 8) {
        proficiencyBonus = 3;
    } else if (updatedCharacter.level > 8 && level <= 12) {
        proficiencyBonus = 4;
    } else if (updatedCharacter.level > 12 && level <= 16) {
        proficiencyBonus = 5;
    } else {
        proficiencyBonus = 6;
    }

    let strMod = updatedAbilityScores.strength >= 10 ? Math.floor((updatedAbilityScores.strength - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.strength) / 2);

    let dexMod = updatedAbilityScores.dexterity >= 10 ? Math.floor((updatedAbilityScores.dexterity - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.dexterity) / 2);
    let conMod = updatedAbilityScores.constitution >= 10 ? Math.floor((updatedAbilityScores.constitution - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.constitution) / 2);
    let intMod = updatedAbilityScores.intellect >= 10 ? Math.floor((updatedAbilityScores.intellect - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.intellect) / 2);
    let wisMod = updatedAbilityScores.wisdom >= 10 ? Math.floor((updatedAbilityScores.wisdom - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.wisdom) / 2);
    let chaMod = updatedAbilityScores.charisma >= 10 ? Math.floor((updatedAbilityScores.charisma - 10) / 2) : -Math.ceil((10 - updatedAbilityScores.charisma) / 2);

    const matching_scores_to_mods = {
        "Strength": strMod,
        "Dexterity": dexMod,
        "Constitution": conMod,
        "Intellect": intMod,
        "Wisdom": wisMod,
        "Charisma": chaMod
    };


    const skillProficiencyBonuses = fetchedProficiencies.map(proficiency => {
        if (proficiency.ability_score) {
            if (updatedCharacter.proficiencies.some(proficiencyObject => proficiencyObject.id === proficiency.id)) {
                return {
                    name: proficiency.name,
                    value: proficiencyBonus + matching_scores_to_mods[proficiency.ability_score] >= 0 ? ` +${proficiencyBonus + matching_scores_to_mods[proficiency.ability_score]}` : `${proficiencyBonus + matching_scores_to_mods[proficiency.ability_score]}`
                };
            }
            return {
                name: proficiency.name,
                value: matching_scores_to_mods[proficiency.ability_score] >= 0 ? ` +${matching_scores_to_mods[proficiency.ability_score]}` : ` ${matching_scores_to_mods[proficiency.ability_score]}`
            };
        }
        return {
            name: proficiency.name,
            value: null
        };
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittableCharacter = { ...updatedCharacter };
        submittableCharacter.level = Number(updatedCharacter.level);
        const { validatedCharacter, validationErrors: errors } = validateCharacterEdit({ ...submittableCharacter });
        if (!validatedCharacter) {
            setValidationErrors(errors);
        }
        else {
            setValidationErrors(templateErrors);
        }
    }

    return (
        <form data-bs-theme="dark" onSubmit={handleSubmit}>
            <div>
                {Object.values(validationErrors).some(error => error !== "") && <div className={`${styles.validationError} text-center fs-4`}>There are errors in the edit, check the page to see what mistake you made</div>}

                {validationErrors.id && <div className={styles.validationError}>{validationErrors.id}</div>}
                <div className="row row-cols-3 align-items-center mb-2">
                    <div className="col form-check form-switch d-flex justify-content-center gap-5 align-items-center" data-bs-them="dark">
                        <label className={!readyToEdit ? "d-none" : "form-check-label"} htmlFor="edit" >Edit</label>
                        <input disabled={!readyToEdit} className={!readyToEdit ? "d-none" : "form-check-input"} role="switch" type="checkbox" id="edit" name="edit" checked={editMode} onChange={() => setEditMode(current => !current)}></input>
                        {editMode && <div>
                            <button className={`btn ${styles.featureButton}`} type="submit">Salva le modifiche</button>

                        </div>
                        }
                    </div>
                    {!editMode ?
                        <h2 className={`${styles.name} col`}>{name}</h2>
                        :
                        <div>
                            <input onChange={handleEdit} type="text" required className="form-control" name="name" id="name" value={updatedCharacter.name}></input>
                            {validationErrors.name && <div className={styles.validationError}>{validationErrors.name}</div>}
                        </div>
                    }
                    <h2 className={`${styles.name} col d-flex justify-content-center mb-0`}>Level:
                        {!editMode ?
                            level :
                            <div>
                                <input min={1} max={20} onChange={handleEdit} type="number" required className="form-control" name="level" id="level" value={updatedCharacter.level} />
                                {validationErrors.level && <div className={styles.validationError}>{validationErrors.level}</div>}
                            </div>
                        }

                    </h2>
                </div>
                {
                    editMode ?
                        <div>
                            <div className="my-2">
                                <label className="form-label" htmlFor="image">Cambia immagine</label>
                                <input onChange={handleEdit} className="form-control" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" name="image" id="image"></input>
                            </div>
                            <img className={styles.jumboCharacterImage} src={previewUrl ? previewUrl : updatedCharacter.image} />
                        </div>
                        :
                        <img className={styles.jumboCharacterImage} src={updatedCharacter.image} />
                }
                <section className="container my-2">
                    <div className={`d-flex justify-content-center ${styles.infoSection}`}>
                        <div className={`${styles.class} text-center`}>
                            <h5>Class:</h5>
                            {
                                !editMode ?
                                    <h6>{profession.name}</h6> :
                                    <div>
                                        <select onChange={handleEdit} className="form-select" name="profession" id="profession" value={updatedCharacter.profession.id}>
                                            {classes.map(classOption => <option key={`class-${classOption.id}`} value={classOption.id}>{classOption.name}</option>)}
                                        </select>
                                        {validationErrors.profession && <div className={styles.validationError}>{validationErrors.profession}</div>}
                                    </div>
                            }
                        </div>
                        <div className={`${styles.background} text-center`}>
                            <h5>Background:</h5>
                            {!editMode ?
                                <h6>{background.name}</h6> :
                                <div>
                                    <select onChange={handleEdit} className="form-select" name="background" id="background" value={updatedCharacter.background.id}>
                                        {backgrounds.map(background => <option key={`class-${background.id}`} value={background.id}>{background.name}</option>)}
                                    </select>
                                    {validationErrors.background && <div className={styles.validationError}>{validationErrors.background}</div>}
                                </div>
                            }
                        </div>
                        <div className={`${styles.species} text-center`}>
                            <h5>Race:</h5>
                            {!editMode ?
                                <h6>{species.name}</h6> :
                                <div>
                                    <select onChange={handleEdit} className="form-select" name="species" id="species" value={updatedCharacter.species.id}>
                                        {races.map(race => <option key={`class-${race.id}`} value={race.id}>{race.name}</option>)}
                                    </select>
                                    {validationErrors.species && <div className={styles.validationError}>{validationErrors.species}</div>}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row row-cols-3 row-cols-lg-6">
                        <div className={styles.abilityScore}>
                            <h5>Strength</h5>
                            {!editMode ?
                                <div>
                                    <p>{strength}</p>
                                    <p>{strMod >= 0 ? `+${strMod}` : `${strMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.strength} type="number" required min={1} name="strength" id="strength" />
                                    <p>{strMod >= 0 ? `+${strMod}` : `${strMod}`}</p>
                                    {validationErrors.strength && <div className={styles.validationError}>{validationErrors.strength}</div>}
                                </div>
                            }
                        </div>
                        <div className={styles.abilityScore}>
                            <h5>Dexterity</h5>
                            {!editMode ?
                                <div>
                                    <p>{dexterity}</p>
                                    <p>{dexMod >= 0 ? `+${dexMod}` : `${dexMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.dexterity} type="number" required min={1} name="dexterity" id="dexterity" />
                                    <p>{dexMod >= 0 ? `+${dexMod}` : `${dexMod}`}</p>
                                    {validationErrors.dexterity && <div className={styles.validationError}>{validationErrors.dexterity}</div>}
                                </div>
                            }
                        </div>
                        <div className={styles.abilityScore}>
                            <h5>Constitution</h5>
                            {!editMode ?
                                <div>
                                    <p>{constitution}</p>
                                    <p>{conMod >= 0 ? `+${conMod}` : `${conMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.constitution} type="number" required min={1} name="constitution" id="constitution" />
                                    <p>{conMod >= 0 ? `+${conMod}` : `${conMod}`}</p>
                                    {validationErrors.constitution && <div className={styles.validationError}>{validationErrors.constitution}</div>}
                                </div>
                            }
                        </div>
                        <div className={styles.abilityScore}>
                            <h5>Intellect</h5>
                            {!editMode ?
                                <div>
                                    <p>{intellect}</p>
                                    <p>{intMod >= 0 ? `+${intMod}` : `${intMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.intellect} type="number" required min={1} name="intellect" id="intellect" />
                                    <p>{intMod >= 0 ? `+${intMod}` : `${intMod}`}</p>
                                    {validationErrors.intellect && <div className={styles.validationError}>{validationErrors.intellect}</div>}
                                </div>
                            }
                        </div>
                        <div className={styles.abilityScore}>
                            <h5>Wisdom</h5>
                            {!editMode ?
                                <div>
                                    <p>{wisdom}</p>
                                    <p>{wisMod >= 0 ? `+${wisMod}` : `${wisMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.wisdom} type="number" required min={1} name="wisdom" id="wisdom" />
                                    <p>{wisMod >= 0 ? `+${wisMod}` : `${wisMod}`}</p>
                                    {validationErrors.wisdom && <div className={styles.validationError}>{validationErrors.wisdom}</div>}
                                </div>
                            }
                        </div>
                        <div className={styles.abilityScore}>
                            <h5>Charisma</h5>
                            {!editMode ?
                                <div>
                                    <p>{charisma}</p>
                                    <p>{chaMod >= 0 ? `+${chaMod}` : `${chaMod}`}</p>
                                </div>
                                :
                                <div>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.charisma} type="number" required min={1} name="charisma" id="charisma" />
                                    {validationErrors.charisma && <div className={styles.validationError}>{validationErrors.charisma}</div>}
                                    <p>{chaMod >= 0 ? `+${chaMod}` : `${chaMod}`}</p>
                                </div>
                            }
                        </div>
                    </div>
                </section>
                <section className="container">
                    <div className="row row-cols-1 row-cols-lg-3">
                        <div className="col text-center">
                            <h5>Skill Proficiencies:</h5>
                            {proficiencyError ? "Errore nel caricamento delle proficiencies" : proficiencyPending ? "Stiamo caricando le proficiencies" :
                                !editMode ?
                                    skillProficiencies.map(proficiency =>
                                        <div key={proficiency.id}>
                                            <p className={proficiencies.some(proficiencyObject => proficiencyObject.id === proficiency.id) ? `${styles.proficiency} ${styles.activeProficiency}` : styles.proficiency} >
                                                {proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name).value}
                                            </p>
                                        </div>)
                                    :
                                    <div>
                                        {skillProficiencies.map(proficiency =>
                                            <div className="d-flex gap-2" key={proficiency.id}>
                                                <input name={proficiency.name} id={proficiency.name} onChange={handleEdit} className="form-check" type="checkbox" checked={updatedCharacter.proficiencies.map(proficiency => proficiency.id).includes(proficiency.id)} value={proficiency.id} />
                                                <label className="form-check-label" htmlFor={proficiency.name}>{proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name).value}</label>
                                            </div>
                                        )}
                                        {validationErrors.proficiencies && <div className={styles.validationError}>{validationErrors.proficiencies}</div>}
                                    </div>
                            }
                        </div>
                        <div className="col text-center">
                            <h5>Tool Proficiencies:</h5>
                            {!editMode ?
                                toolProficiencies.map(proficiency =>
                                    <div key={proficiency.id}>
                                        <p className={proficiencies.some(proficiencyObject => proficiencyObject.id === proficiency.id) ? `${styles.proficiency} ${styles.activeProficiency}` : styles.proficiency} >
                                            {proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name)?.value}
                                        </p>
                                    </div>)
                                :
                                <div>
                                    {allToolProficiencies.map(proficiency =>
                                        <div className="d-flex gap-2" key={proficiency.id}>
                                            <input name={proficiency.name} id={proficiency.name} onChange={handleEdit} className="form-check" type="checkbox" checked={updatedCharacter.proficiencies.map(proficiency => proficiency.id).includes(proficiency.id)} value={proficiency.id} />
                                            <label className="form-check-label" htmlFor={proficiency.name}>{proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name).value}</label>
                                        </div>
                                    )}
                                    {validationErrors.proficiencies && <div className={styles.validationError}>{validationErrors.proficiencies}</div>}
                                </div>
                            }
                        </div>
                        <div className="col text-center">
                            <h5>Weapon Proficiencies:</h5>
                            {
                                weaponProficiencies.map(proficiency =>
                                    <div key={proficiency.id}>
                                        <p className={`${styles.proficiency} ${styles.activeProficiency}`}>
                                            {proficiency.name}
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </section>

                <section className="container">
                    <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setClassFeaturesOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${classFeaturesOpened ? styles.buttonOpened : ""}`} type="button">
                        Class Features
                    </button>
                    <div className={`${classFeaturesOpened ? "d-block" : "d-none"}`} id="classFeatures">

                        {
                            updatedCharacter.profession.features.map(feature => <div className={styles.feature} key={`${updatedCharacter.profession.id}-${feature.id}`}>
                                <h6 >{feature.name}</h6>
                                <p dangerouslySetInnerHTML={{ __html: `${feature.description}` }} />
                            </div>
                            )
                        }
                    </div>
                    <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setSpeciesFeaturesOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${speciesFeaturesOpened ? styles.buttonOpened : ""}`} type="button">
                        Species Features
                    </button>
                    <div className={`${speciesFeaturesOpened ? "d-block" : "d-none"}`} id="speciesFeatures">
                        {
                            updatedCharacter.species.features.map(feature => <div className={styles.feature} key={feature.id}>
                                <h6 >{feature.name}</h6>
                                <p dangerouslySetInnerHTML={{ __html: `${feature.description}` }} />
                            </div>
                            )
                        }

                    </div>
                    {feats &&
                        <div>
                            <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setFeatsOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${featsOpened ? styles.buttonOpened : ""}`} type="button">
                                Feats
                            </button>
                            <div className={`${featsOpened ? "d-block" : "d-none"}`} id="feats">
                                {updatedCharacter.feats.map(feat => <div key={feat.id} className={styles.feature}>
                                    <h6>{feat.name}</h6>
                                    <p dangerouslySetInnerHTML={{ __html: `${feat.description}` }} />
                                </div>)}
                            </div>
                            {
                                editMode && numberOfFeats >= 1 &&
                                <div>
                                    <h6>Seleziona {numberOfFeats} feats:</h6>
                                    <div className="d-flex flex-column">
                                        {selectableFeats.map(feat => <div className="d-flex gap-2" key={`${feat.name}-${feat.id}`}>
                                            <input checked={featList.map(feat => feat.id).includes(feat.id)} onChange={handleEdit} className="form-check" id={feat.name} name="feats" value={feat.id} type="checkbox"></input>
                                            <label className="form-label mb-0" htmlFor={feat.name}>{feat.name}</label>
                                        </div>)}
                                    </div>
                                    {validationErrors.feats && <div className={styles.validationError}>{validationErrors.feats}</div>}
                                </div>
                            }
                        </div>
                    }
                </section>
                {updatedCharacter.profession.spells.length > 0 &&
                    <section className="container" id="spells">
                        <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setSpellsOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${spellsOpened ? styles.buttonOpened : ""}`} type="button">
                            Spells
                        </button>
                        <div className={`${spellsOpened ? "d-block" : "d-none"} ${styles.spellTable}`}>
                            {
                                <table>
                                    <thead>
                                        <tr>
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
                                            updatedCharacter.profession.spells.sort((a, b) => a.level - b.level).map(spell => {
                                                return (
                                                    <tr key={`${spell.id}-spell`}>
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
                {updatedCharacter.backstory &&
                    <div className="container">
                        <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setBackstoryOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${backstoryOpened ? styles.buttonOpened : ""}`} type="button">
                            Backstory
                        </button>
                        <div className={`${backstoryOpened ? `d-block ${styles.backstory}` : "d-none"}`} id="backstory">
                            {!editMode ?
                                <p dangerouslySetInnerHTML={{ __html: `${updatedCharacter.backstory}` }}></p>
                                :
                                <div>
                                    <textarea className="form-control" name="backstory" id="backstory" onChange={handleEdit} value={updatedCharacter.backstory}></textarea>
                                    {validationErrors.backstory && <div className={styles.validationError}>{validationErrors.backstory}</div>}
                                </div>
                            }
                        </div>
                    </div>
                }
                {updatedCharacter.inventory &&
                    <div className="container">
                        <button onMouseLeave={(e) => { e.currentTarget.blur }} onClick={() => { setInventoryOpened((current) => !current) }} className={`my-4 d-block btn ${styles.featureButton} ${inventoryOpened ? styles.buttonOpened : ""}`} type="button">
                            Inventory
                        </button>
                        <div className={`${inventoryOpened ? `d-block ${styles.backstory}` : "d-none"}`} id="backstory">
                            {!editMode ?
                                <p dangerouslySetInnerHTML={{ __html: `${updatedCharacter.inventory}` }}></p>
                                :
                                <div>
                                    <textarea className="form-control" name="inventory" id="inventory" onChange={handleEdit} value={updatedCharacter.inventory}></textarea>
                                    {validationErrors.inventory && <div className={styles.validationError}>{validationErrors.inventory}</div>}
                                </div>
                            }
                        </div>
                    </div>
                }

            </div>
        </form>
    )
}

export default CharacterShow