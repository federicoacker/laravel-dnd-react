
const mapper = [
    function (currentPath) {
        if (/^\/characters\/\d+$/.test(currentPath)) {
            return "characterShow";
        }
    },
    function (currentPath) {
        if (/^\/races\/\d+$/.test(currentPath)) {
            return "raceShow";
        }
    },
    function (currentPath) {
        if (/^\/backgrounds\/\d+$/.test(currentPath)) {
            return "backgroundShow";
        }
    },
    function (currentPath) {
        if (/^\/classes\/\d+$/.test(currentPath)) {
            return "classShow";
        }
    },
    function (currentPath) {
        if (/^\/features\/\d+$/.test(currentPath)) {
            return "featureShow";
        }
    },
    function (currentPath) {
        if (/^\/feats\/\d+$/.test(currentPath)) {
            return "featShow";
        }
    },
    function (currentPath) {
        if (/^\/spells\/\d+$/.test(currentPath)) {
            return "spellShow";
        }
    },
    function (currentPath) {
        switch (currentPath) {
            case "/":
                return "index";
            case "/characters":
                return "characters";
            case "/newCharacter":
                return "characterCreate";
            case "/login":
                return "login";
            case "/register":
                return "register";
            case "/races":
                return "races";
            case "/backgrounds":
                return "backgrounds";
            case "/classes":
                return "classes";
            case "/features":
                return "features";
            case "/feats":
                return "feats";
            case "/proficiencies":
                return "proficiencies";
            case "/spells":
                return "spells";
            default:
                return "index";
        }
    }
]

function validator(currentPath, defValue = "index") {
    let ret;
    for (let i = 0; i < mapper.length; i++) {
        const fn = mapper[i];
        ret = fn(currentPath);
        if (ret !== undefined) {
            break;
        }
    }
    return ret === undefined ? defValue : ret;
}

export default validator;