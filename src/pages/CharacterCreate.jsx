
import { useState } from 'react';
import styles from './CharacterCreate.module.css';
import useUser from '../hooks/useUser';
import useClasses from '../hooks/useClasses';
import useBackgrounds from '../hooks/useBackgrounds';
import useSpecies from '../hooks/useSpecies';
import useFeats from '../hooks/useFeats';
import useProficiencies from '../hooks/useProficiencies';
import validateCharacterCreate from '../utils/functions/validateCharacterCreate';
import { useNavigate } from 'react-router';

function CharacterCreate() {
    const { user } = useUser();
    const { proficiencyError, proficiencyPending, proficiencies: fetchedProficiencies } = useProficiencies();
    const [classFeaturesOpened, setClassFeaturesOpened] = useState(false);
    const [speciesFeaturesOpened, setSpeciesFeaturesOpened] = useState(false);
    const [featsOpened, setFeatsOpened] = useState(false);
    const [spellsOpened, setSpellsOpened] = useState(false);
    const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState("");
    const { classes, classPending, classError } = useClasses();
    const { backgrounds, backgroundPending, backgroundError } = useBackgrounds();
    const { species: races, racePending, raceError } = useSpecies();
    const { feats: fetchedFeats, featPending, featError } = useFeats();

    const readyToCreate = !proficiencyError && !proficiencyPending && !classPending && !classError && !backgroundPending && !backgroundError && !racePending && !raceError && !featPending && !featError;
    const [newCharacter, setNewCharacter] = useState(
        {
            name: "",
            level: 1,
            background: backgrounds[0],
            backstory: "",
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intellect: 10,
            wisdom: 10,
            charisma: 10,
            image: "",
            inventory: "",
            profession: classes[0],
            species: races[0],
            proficiencies: [],
            feats: [],
            owner_id: user.id,
            is_public: 0
        }
    );

    const numberOfFeats = Math.floor(newCharacter.level / 4);
    const selectableFeats = fetchedFeats.filter(feat => feat.id !== newCharacter.background?.feat.id);
    const [featList, setFeatList] = useState(newCharacter.feats);

    const [updateError, setUpdateError] = useState("");
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

    const [updatedAbilityScores, setUpdatedAbilityScores] = useState({
        strength: newCharacter.strength,
        dexterity: newCharacter.dexterity,
        constitution: newCharacter.constitution,
        intellect: newCharacter.intellect,
        wisdom: newCharacter.wisdom,
        charisma: newCharacter.charisma
    });

    const handleAbilityScoreEdit = (event) => {
        const score = event.target.name;
        const value = event.target.value;

        setUpdatedAbilityScores({
            ...updatedAbilityScores,
            [score]: Number(value)
        });
        setNewCharacter((current) => { return { ...current, [score]: Number(value) } })
    }

    const handleEdit = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        const type = event.target.type;

        if (type === "checkbox" && field === "is_public") {
            const newValue = newCharacter.is_public === 1 ? 0 : 1;
            console.log(newValue);
            setNewCharacter({
                ...newCharacter,
                is_public: newValue
            });
            return;
        }
        else if (type === "checkbox" && field !== "feats") {
            let newProficiencies = newCharacter.proficiencies.map(proficiency => { return { name: proficiency.name, id: proficiency.id, type: proficiency.type } });
            if (newProficiencies.map(proficiency => proficiency.id).includes(Number(value))) {
                newProficiencies = newProficiencies.filter(proficiency => proficiency.id !== Number(value));
            }
            else {
                newProficiencies.push({ name: field, id: Number(value), type: event.target.dataset.type });
            }
            console.log(newProficiencies);

            setNewCharacter(
                {
                    ...newCharacter,
                    proficiencies: newProficiencies
                }
            );
            return;

        }
        else if (field === "profession") {
            const newProfession = classes.find(profession => profession.id === Number(value));
            let inventoryText = newCharacter.background?.equipment;
            if (!inventoryText?.includes(newProfession?.starting_equipment)) {
                inventoryText += " " + newProfession?.starting_equipment ? newProfession?.starting_equipment : "";
            }
            setNewCharacter(
                {
                    ...newCharacter,
                    profession: newProfession,
                    inventory: inventoryText,
                    proficiencies: []
                }
            );
            return;
        }
        else if (field === "species") {

            setNewCharacter(
                {
                    ...newCharacter,
                    species: races.find(race => race.id === Number(value))
                }
            )
            return;
        }
        else if (field === "background") {
            const newBackground = backgrounds.find(background => background.id === Number(value))
            const newFeats = newCharacter.feats.filter(feat => feat.id !== newCharacter.background.feat.id);
            newFeats.push(newBackground.feat);
            let inventoryText = newCharacter.profession?.starting_equipment;
            if (!inventoryText?.includes(newBackground?.equipment)) {
                inventoryText += " " + newBackground?.equipment ? newBackground?.equipment : "";
            }
            setFeatList(newFeats);
            setNewCharacter(
                {
                    ...newCharacter,
                    background: newBackground,
                    feats: newFeats,
                    inventory: inventoryText
                }
            )
            return;
        }
        else if (field === "image") {
            const file = event.target.files[0];
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
                setNewCharacter(
                    {
                        ...newCharacter,
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

            setNewCharacter((current) => {
                return { ...current, feats: recoveredFeats }
            })
            return;
        }

        setNewCharacter(
            {
                ...newCharacter,
                [field]: value
            }
        )
    }

    let proficiencyBonus;

    if (newCharacter.level <= 4) {
        proficiencyBonus = 2;
    } else if (newCharacter.level > 4 && newCharacter.level <= 8) {
        proficiencyBonus = 3;
    } else if (newCharacter.level > 8 && newCharacter.level <= 12) {
        proficiencyBonus = 4;
    } else if (newCharacter.level > 12 && newCharacter.level <= 16) {
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

    const skillProficiencies = fetchedProficiencies.filter(proficiency => proficiency.type === "Skill");
    const weaponProficiencies = newCharacter.profession?.proficiencies?.filter(proficiency => proficiency.type === "Weapon");
    const allToolProficiencies = fetchedProficiencies.filter(proficiency => proficiency.type === "Tool" || proficiency.type === "Musical Instrument");

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
            if (newCharacter.proficiencies?.some(proficiencyObject => proficiencyObject.id === proficiency.id)) {
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


    const handleSubmit = async (event) => {
        event.preventDefault();
        const submittableCharacter = { ...newCharacter, level: Number(newCharacter.level) };
        const { validatedCharacter, validationErrors: errors } = validateCharacterCreate(submittableCharacter);

        if (!validatedCharacter) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors(templateErrors);
        setUpdateError("");

        const formData = new FormData();

        const appendFormData = (value, key) => {
            if (value === undefined) {
                return;
            }

            if (value === null) {
                formData.append(key, "");
                return;
            }

            if (value instanceof File) {
                formData.append(key, value);
                return;
            }

            if (typeof value === "boolean") {
                formData.append(key, value ? "1" : "0");
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    appendFormData(item, `${key}[${index}]`);
                });
                return;
            }

            if (typeof value === "object") {
                Object.entries(value).forEach(([childKey, childValue]) => {
                    appendFormData(childValue, key ? `${key}[${childKey}]` : childKey);
                });
                return;
            }

            formData.append(key, String(value));
        };

        const payload = {
            name: validatedCharacter.name,
            level: validatedCharacter.level,
            background_id: validatedCharacter.background?.id ?? "",
            species_id: validatedCharacter.species?.id ?? "",
            profession_id: validatedCharacter.profession?.id ?? "",
            backstory: validatedCharacter.backstory,
            strength: validatedCharacter.strength,
            dexterity: validatedCharacter.dexterity,
            constitution: validatedCharacter.constitution,
            intellect: validatedCharacter.intellect,
            wisdom: validatedCharacter.wisdom,
            charisma: validatedCharacter.charisma,
            inventory: validatedCharacter.inventory,
            proficiencies: validatedCharacter.proficiencies?.map(({ id }) => id) ?? [],
            feats: validatedCharacter.feats?.map(({ id }) => id) ?? [],
        };

        if (validatedCharacter.is_public !== undefined) {
            payload.is_public = validatedCharacter.is_public;
        }

        Object.entries(payload).forEach(([key, value]) => {
            appendFormData(value, key);
        });

        if (validatedCharacter.image instanceof File) {
            formData.append("image", validatedCharacter.image);
        }

        console.log(Object.fromEntries(formData));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/characters`, {
                method: "POST",
                headers: {
                    Accept: "application/vnd.api+json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            const responseBody = await response.json().catch(() => null);

            if (response.status === 422) {
                setValidationErrors(responseBody?.errors ?? templateErrors);
                setUpdateError("Please correct the validation errors and try again.");
                return;
            }

            if (response.status === 403) {
                setUpdateError("You aren't authorized to create characters");
                return;
            }

            if (!response.ok) {
                setUpdateError(
                    responseBody?.message ?? "There was an error while creating this character"
                );
                return;
            }

            navigate(`/characters/${responseBody.data.id}`);
        } catch {
            setUpdateError("There was an error while creating this character");
        }
    }
    return (
        <div className={styles.card}>
            {!readyToCreate ? "Loading data for the creation" :
                <form data-bs-theme="dark" onSubmit={handleSubmit}>
                    <div>
                        {updateError !== "" && <div className={`${styles.validationError} text-center fs-4`}>{updateError}</div>}
                        {Object.values(validationErrors).some(error => error !== "") && <div className={`${styles.validationError} text-center fs-4`}>Please correct the highlighted errors.</div>}

                        <div className="row row-cols-1 row-cols-lg-3 g-2 align-items-center mb-2">
                            <div className="col d-flex flex-wrap justify-content-center gap-3 align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <label className="form-label mb-0" htmlFor="is_public">Public</label>
                                    <input className="form-check" type="checkbox" id="is_public" name="is_public" checked={newCharacter.is_public === 1} onChange={handleEdit} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="name">Name</label>
                                <input onChange={handleEdit} type="text" required className="form-control" name="name" id="name" value={newCharacter.name}></input>
                                {validationErrors.name && <div className={styles.validationError}>{validationErrors.name}</div>}
                            </div>
                            <div>
                                <label className="form-label" htmlFor="level">Level</label>
                                <input min={1} max={20} onChange={handleEdit} type="number" required className="form-control" name="level" id="level" value={newCharacter.level} />
                                {validationErrors.level && <div className={styles.validationError}>{validationErrors.level}</div>}
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="form-label" htmlFor="image">Character image</label>
                            <input onChange={handleEdit} className="form-control" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" name="image" id="image"></input>
                        </div>
                        {previewUrl && <img className={styles.jumboCharacterImage} src={previewUrl} alt="Character preview" />}
                        <section className="container my-2">
                            <div className={`d-flex justify-content-center ${styles.infoSection}`}>
                                <div className={`${styles.class} text-center`}>
                                    <h5>Class:</h5>
                                    <select onChange={handleEdit} className="form-select" name="profession" id="profession" value={newCharacter.profession?.id}>
                                        {classes.map(classOption => <option key={`class-${classOption.id}`} value={classOption.id}>{classOption.name}</option>)}
                                    </select>
                                    {validationErrors.profession && <div className={styles.validationError}>{validationErrors.profession}</div>}

                                </div>
                                <div className={`${styles.background} text-center`}>
                                    <h5>Background:</h5>
                                    <select onChange={handleEdit} className="form-select" name="background" id="background" value={newCharacter.background?.id}>
                                        {backgrounds.map(background => <option key={`background-${background.id}`} value={background.id}>{background.name}</option>)}
                                    </select>
                                    {validationErrors.background && <div className={styles.validationError}>{validationErrors.background}</div>}

                                </div>
                                <div className={`${styles.species} text-center`}>
                                    <h5>Race:</h5>
                                    <select onChange={handleEdit} className="form-select" name="species" id="species" value={newCharacter.species?.id}>
                                        {races.map(race => <option key={`species-${race.id}`} value={race.id}>{race.name}</option>)}
                                    </select>
                                    {validationErrors.species && <div className={styles.validationError}>{validationErrors.species}</div>}
                                </div>

                            </div>

                            <div className="row row-cols-3 row-cols-lg-6">
                                <div className={styles.abilityScore}>
                                    <h5>Strength</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.strength} type="number" required min={1} name="strength" id="strength" />
                                    <p>{strMod >= 0 ? `+${strMod}` : `${strMod}`}</p>
                                    {validationErrors.strength && <div className={styles.validationError}>{validationErrors.strength}</div>}
                                </div>
                                <div className={styles.abilityScore}>
                                    <h5>Dexterity</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.dexterity} type="number" required min={1} name="dexterity" id="dexterity" />
                                    <p>{dexMod >= 0 ? `+${dexMod}` : `${dexMod}`}</p>
                                    {validationErrors.dexterity && <div className={styles.validationError}>{validationErrors.dexterity}</div>}
                                </div>
                                <div className={styles.abilityScore}>
                                    <h5>Constitution</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.constitution} type="number" required min={1} name="constitution" id="constitution" />
                                    <p>{conMod >= 0 ? `+${conMod}` : `${conMod}`}</p>
                                    {validationErrors.constitution && <div className={styles.validationError}>{validationErrors.constitution}</div>}
                                </div>
                                <div className={styles.abilityScore}>
                                    <h5>Intellect</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.intellect} type="number" required min={1} name="intellect" id="intellect" />
                                    <p>{intMod >= 0 ? `+${intMod}` : `${intMod}`}</p>
                                    {validationErrors.intellect && <div className={styles.validationError}>{validationErrors.intellect}</div>}
                                </div>
                                <div className={styles.abilityScore}>
                                    <h5>Wisdom</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.wisdom} type="number" required min={1} name="wisdom" id="wisdom" />
                                    <p>{wisMod >= 0 ? `+${wisMod}` : `${wisMod}`}</p>
                                    {validationErrors.wisdom && <div className={styles.validationError}>{validationErrors.wisdom}</div>}
                                </div>
                                <div className={styles.abilityScore}>
                                    <h5>Charisma</h5>
                                    <input className="form-control" onChange={handleAbilityScoreEdit} value={updatedAbilityScores.charisma} type="number" required min={1} name="charisma" id="charisma" />
                                    {validationErrors.charisma && <div className={styles.validationError}>{validationErrors.charisma}</div>}
                                    <p>{chaMod >= 0 ? `+${chaMod}` : `${chaMod}`}</p>
                                </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center my-2">
                                <h5>Proficiency Bonus:</h5>
                                {proficiencyBonus}
                            </div>
                        </section>
                        <section className="container">
                            <div className="row row-cols-1 row-cols-lg-3">
                                <div className="col text-center">
                                    <h5>Skill Proficiencies:</h5>
                                    {proficiencyError ? "Errore nel caricamento delle proficiencies" : proficiencyPending ? "Stiamo caricando le proficiencies" :

                                        newCharacter.profession &&
                                        <div>
                                            <h6>Choose {newCharacter.profession?.number_of_skill_proficiencies} proficiencies</h6>
                                            {skillProficiencies.map(proficiency =>
                                                <div className="d-flex gap-2" key={proficiency.id}>
                                                    <input data-type={proficiency.type} name={proficiency.name} id={`skill-${proficiency.id}`} onChange={handleEdit} className="form-check" type="checkbox" checked={newCharacter.proficiencies.map(proficiency => proficiency.id).includes(proficiency.id)} value={proficiency.id} />
                                                    <label className="form-check-label" htmlFor={`skill-${proficiency.id}`}>{proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name)?.value}</label>
                                                </div>
                                            )}
                                            {validationErrors.proficiencies && <div className={styles.validationError}>{validationErrors.proficiencies}</div>}
                                        </div>

                                    }
                                </div>
                                <div className="col text-center">
                                    {newCharacter.profession &&
                                        newCharacter.profession?.number_of_tool_proficiencies > 0 &&
                                        <div>
                                            <h5>Tool Proficiencies:</h5>
                                            <h6>Choose {newCharacter.profession?.number_of_tool_proficiencies} proficiencies</h6>
                                            {allToolProficiencies.filter(proficiency => newCharacter.profession?.type_of_tool_proficiencies ? proficiency.type === newCharacter.profession?.type_of_tool_proficiencies : true).map(proficiency =>
                                                <div className="d-flex gap-2" key={proficiency.id}>
                                                    <input data-type={proficiency.type} name={proficiency.name} id={`tool-${proficiency.id}`} onChange={handleEdit} className="form-check" type="checkbox" checked={newCharacter.proficiencies.map(proficiency => proficiency.id).includes(proficiency.id)} value={proficiency.id} />
                                                    <label className="form-check-label" htmlFor={`tool-${proficiency.id}`}>{proficiency.name} {skillProficiencyBonuses.find(skillProficiencyBonus => skillProficiencyBonus.name === proficiency.name)?.value}</label>
                                                </div>
                                            )}
                                            {validationErrors.proficiencies && <div className={styles.validationError}>{validationErrors.proficiencies}</div>}
                                        </div>

                                    }
                                </div>
                                <div className="col text-center">
                                    <h5>Weapon Proficiencies:</h5>
                                    {
                                        weaponProficiencies?.map(proficiency =>
                                            <div key={proficiency.id}>
                                                <p className={`${styles.proficiency} ${styles.activeProficiency}`}>
                                                    {proficiency.name}
                                                </p>
                                            </div>
                                        )
                                    }
                                    <h5>Armor Training</h5>
                                    {newCharacter.profession?.armor_training
                                    }
                                </div>
                            </div>
                        </section>

                        <section className="container">
                            <button onClick={() => setClassFeaturesOpened(current => !current)} className={`my-4 d-block btn ${styles.featureButton} ${classFeaturesOpened ? styles.buttonOpened : ""}`} type="button">
                                Class Features
                            </button>
                            <div className={`${classFeaturesOpened ? "d-block" : "d-none"}`} id="classFeatures">

                                {
                                    newCharacter.profession?.features?.map(feature => <div className={styles.feature} key={`${newCharacter.profession.id}-${feature.id}`}>
                                        <h6 >{feature.name}</h6>
                                        <p dangerouslySetInnerHTML={{ __html: `${feature.description}` }} />
                                    </div>
                                    )
                                }
                            </div>
                            <button onClick={() => setSpeciesFeaturesOpened(current => !current)} className={`my-4 d-block btn ${styles.featureButton} ${speciesFeaturesOpened ? styles.buttonOpened : ""}`} type="button">
                                Species Features
                            </button>
                            <div className={`${speciesFeaturesOpened ? "d-block" : "d-none"}`} id="speciesFeatures">
                                {
                                    newCharacter.species?.features?.map(feature => <div className={styles.feature} key={feature.id}>
                                        <h6 >{feature.name}</h6>
                                        <p dangerouslySetInnerHTML={{ __html: `${feature.description}` }} />
                                    </div>
                                    )
                                }

                            </div>
                            <div>
                                <button onClick={() => setFeatsOpened(current => !current)} className={`my-4 d-block btn ${styles.featureButton} ${featsOpened ? styles.buttonOpened : ""}`} type="button">
                                    Selected Feat Details
                                </button>
                                <div className={`${featsOpened ? "d-block" : "d-none"}`} id="feats">
                                    {newCharacter.feats.map(feat => <div key={feat.id} className={styles.feature}>
                                        <h6>{feat.name}</h6>
                                        <p dangerouslySetInnerHTML={{ __html: `${feat.description}` }} />
                                    </div>)}
                                </div>
                                {numberOfFeats >= 1 &&
                                    <div>
                                        <h6>Select up to {numberOfFeats} feats:</h6>
                                        <div className="d-flex flex-column">
                                            {selectableFeats.map(feat => <div className="d-flex gap-2" key={`${feat.name}-${feat.id}`}>
                                                <input checked={featList.map(feat => feat.id).includes(feat.id)} onChange={handleEdit} className="form-check" id={`feat-${feat.id}`} name="feats" value={feat.id} type="checkbox"></input>
                                                <label className="form-label mb-0" htmlFor={`feat-${feat.id}`}>{feat.name}</label>
                                            </div>)}
                                        </div>
                                        {validationErrors.feats && <div className={styles.validationError}>{validationErrors.feats}</div>}
                                    </div>
                                }
                            </div>
                        </section>
                        {newCharacter.profession?.spells?.length > 0 &&
                            <section className="container" id="spells">
                                <button onClick={() => setSpellsOpened(current => !current)} className={`my-4 d-block btn ${styles.featureButton} ${spellsOpened ? styles.buttonOpened : ""}`} type="button">
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
                                                    newCharacter.profession.spells.sort((a, b) => a.level - b.level).map(spell => {
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
                        <div className="container">
                            <label className="form-label" htmlFor="backstory">Backstory</label>
                            <textarea className="form-control" name="backstory" id="backstory" onChange={handleEdit} value={newCharacter.backstory}></textarea>
                            {validationErrors.backstory && <div className={styles.validationError}>{validationErrors.backstory}</div>}
                        </div>
                        <div className="container">
                            <label className="form-label" htmlFor="inventory">Inventory</label>
                            <textarea className="form-control" name="inventory" id="inventory" onChange={handleEdit} value={newCharacter.inventory}></textarea>
                            {validationErrors.inventory && <div className={styles.validationError}>{validationErrors.inventory}</div>}
                        </div>
                    </div>
                    <button disabled={!readyToCreate} className={`btn ${styles.featureButton} my-2`} type="submit">Create character</button>
                </form>
            }
        </div>
    )
}

export default CharacterCreate