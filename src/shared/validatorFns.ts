export let validate = (vTypes: validatorTypes[]) => (value: string, callback) => {
    let validationFailed = false;
    for (let index = 0; index < vTypes.length; index++) {
        const v = vTypes[index];
        if (v === validatorTypes.REQUIRED) {
            if (!requiredValidator(value)) {
                callback(false);
                validationFailed = true;
                break;
            }
        } else if (v === validatorTypes.EMAIL) {
            if (!emailValidator(value)) {
                callback(false);
                validationFailed = true;
                break;
            }
        } else if (v === validatorTypes.SSN) {
            if (!ssnValidator(value)) {
                callback(false);
                validationFailed = true;
                break;
            }
        }
    }
    if (!validationFailed) {
        callback(true);
    }
};

export enum validatorTypes {
    REQUIRED = 1,
    EMAIL = 2,
    SSN = 3
}

const requiredValidator = (value: string) => {
    if (!value || value.trim() === '') {
        return false;
    } else {
        return true;
    }
};
const emailValidator = (value: string) => {
    if (!value || value.trim() === '') {
        return true;
    } else if (/.+@.+/.test(value)) {
        return true;
    } else {
        return false;
    }
};

const ssnValidator = (value: string) => {
    if (!value || value.trim() === '') {
        return true;
    } else if (/^((?!666|000)[0-8][0-9\_]{2}\-(?!00)[0-9\_]{2}\-(?!0000)[0-9\_]{4})*$/.test(value)) {
        return true;
    } else {
        return false;
    }
};

