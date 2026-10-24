
function validateCharacterCreate({ image, is_public, name, level, background, backstory, strength, dexterity, constitution, intellect, wisdom, charisma, inventory, profession, species, proficiencies, feats }) {

    const validationErrors = {
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
    }
    if (!name || typeof (name) !== "string") {
        validationErrors.name = "The name must be a string";
    }
    if (!level || typeof (level) !== "number" || level > 20 || level < 1) {
        validationErrors.level = "The level must be a number between 1 and 20";
    }
    if (!background || !background.id) {
        validationErrors.background = "You must select a background from the list";
    }
    if (!backstory || typeof (backstory) !== "string") {
        validationErrors.backstory = "You must write a backstory";
    }
    if (!strength || typeof (strength) !== "number") {
        validationErrors.strength = "You must input a value for your strength";
    }
    if (!dexterity || typeof (dexterity) !== "number") {
        validationErrors.dexterity = "You must input a value for your dexterity";
    }
    if (!constitution || typeof (constitution) !== "number") {
        validationErrors.constitution = "You must input a value for your constitution";
    }
    if (!intellect || typeof (intellect) !== "number") {
        validationErrors.intellect = "You must input a value for your intellect";
    }
    if (!wisdom || typeof (wisdom) !== "number") {
        validationErrors.wisdom = "You must input a value for your wisdom";
    }
    if (!charisma || typeof (charisma) !== "number") {
        validationErrors.charisma = "You must input a value for your charisma";
    }
    if (!inventory || typeof (inventory) !== "string") {
        validationErrors.inventory = "You must write in your inventory";
    }
    if (!profession || !profession.id) {
        validationErrors.profession = "You must select a class from the list";
    }
    if (!species || !species.id) {
        validationErrors.species = "You must select a race from the list";
    }
    if (!feats || !Array.isArray(feats) || feats.some(feat => !feat.id || typeof (feat.id) !== "number") || feats.length > Math.floor(level/4)+1) {
        validationErrors.feats = "There is an error in your feats";
    }
    if (!proficiencies || 
        !Array.isArray(proficiencies) || 
        proficiencies.some(proficiency => !proficiency.id || typeof (proficiency.id) !== "number")
    ) {
        validationErrors.proficiencies = "There is an error in your proficiencies";
    }
    const skillProficiencies = proficiencies.filter(proficiency => proficiency.type === "Skill");
    const toolProficiencies = proficiencies.filter(proficiency => proficiency.type !== "Weapon" && proficiency.type !== "Skill");
    if(skillProficiencies.length !== profession.number_of_skill_proficiencies){
        validationErrors.proficiencies += " - You chose the wrong number of skill proficiencies";
    }
    if(toolProficiencies.length !== profession.number_of_tool_proficiencies){
        validationErrors.proficiencies += " - You chose the wrong number of tool proficiencies";
    }
    if(profession.type_of_tool_proficiencies && toolProficiencies.some(proficiency => proficiency.type !== profession.type_of_tool_proficiencies)){
        validationErrors.proficiencies += " - Some of your tool proficiencies are the wrong type";
    }

    let validatedCharacter = null;

    if (Object.values(validationErrors).some(value => value !== "")) {
        return { validatedCharacter, validationErrors }
    }
    else {
        validatedCharacter = {
            is_public,
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
            inventory,
            profession,
            species,
            proficiencies,
            feats,
            image
        }
        return {validatedCharacter, validationErrors};
    }
}

export default validateCharacterCreate