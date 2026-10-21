
const mapper = [
    function (currentPath) {
        if (/^\/characters\/\d+$/.test(currentPath)) {
            return "characterShow";
        }
    },
    function (currentPath) {
        switch (currentPath) {
            case "/":
                return "index"
            case "/characters":
                return "characters"
            case "/newCharacter":
                return "characterCreate"
            case "/login":
                return "login"
            case "/register":
                return "register"
            default:
                return "index"
        }
    }
]

function validator(currentPath, defValue = "index"){
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