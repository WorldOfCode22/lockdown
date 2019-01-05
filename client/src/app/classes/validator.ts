export interface IValidate {
    min: number;
    max: number;
    capLetters?: number;
    specialChars?: number;
}

function validate(val: string, valDisplayName: string, validator: IValidate) {
    const specialChars = '!@#$%^&*()_-+={[]}:;.>,</`~';
    let specialCharCount = 0;
    let enoughSpecialChars = false;
    let capitalLetterCount = 0;
    let enoughCapitalLetters = false;
    if (val.length < validator.min) {
        return `${valDisplayName} must be at least ${validator.min} characters long`;
    }
    if (val.length > validator.max) {
        return `${valDisplayName} must less than ${validator.min} characters long`;
    }
    if (validator.specialChars) {
        for (const char of val) {
            if (specialCharCount >= validator.specialChars) { enoughSpecialChars = true; break; }
            if (specialChars.indexOf(char) > -1) { specialCharCount++; }
        }
        if (!enoughSpecialChars) {
            return `${valDisplayName} must have at least ${validator.specialChars} special characters.
            Special characters include ${specialChars}`;
        }
    }
    if (validator.capLetters) {
        for (const char of val) {
            if (capitalLetterCount >= validator.capLetters) { enoughCapitalLetters = true; break; }
            if (specialChars.indexOf(char) === -1 && char.toUpperCase() === char) { capitalLetterCount++; }
        }
        if (!enoughCapitalLetters) {
            return `${valDisplayName} must have at least ${validator.capLetters} capital letters.`;
        }
    }
    return true;
}

export function Validator() {
    const username: IValidate = {min: 8, max: 20};
    const password: IValidate = {min: 8, max: 18, capLetters: 1, specialChars: 1};
    return {
        username,
        password,
        validate
    };
}
