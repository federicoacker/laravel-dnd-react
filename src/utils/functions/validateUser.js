
function validateUser(user){
    let validatedUser = {};
    let errors = {
        type: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    };
    const specialCharactersRegex = /[^a-zA-Z0-9]/;

    // eslint-disable-next-line no-control-regex
    const emailRFC5322Regex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])', 'i');

    if(!user){
        errors.type = "Non è stato ricevuto un utente";
    }
    if(!user?.name || typeof(user?.name) !== "string" || user?.name.length < 5 || specialCharactersRegex.test(user?.name)){
        errors.name = "E' necessario inserire uno username che contenga solo lettere e numeri e abbia almeno 5 caratteri";
    }
    if(!user?.email || typeof(user?.email) !== "string" || user?.email < 5 || !emailRFC5322Regex.test(user?.email)){
        errors.email = "E' necessario inserire un'email valida";
    }
    if(!user?.password || typeof(user?.password) !== "string" || user?.password < 5){
        errors.password = "E' necessario inserire una password di almeno 5 caratteri";
    }
    if(!user?.password_confirmation || typeof(user?.password_confirmation) !== "string" || user?.password_confirmation != user?.password){
        errors.password_confirmation = "Le due password inserite non corrispondono";
    }

    if(Object.values(errors).every( x => x === "")){
        validatedUser = user;
    }

    return {validatedUser, errors};
}

export default validateUser;