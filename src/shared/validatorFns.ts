export let emailValidator = (value, callback) => {
    if (/.+@.+/.test(value)) {
        callback(true);
    } else {
        callback(false);
    }
}
