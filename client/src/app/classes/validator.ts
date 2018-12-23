export interface IValidatorResponse {
  valid: boolean;
  reason?: string;
}

export abstract class Validator {
  static SpecialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=',
   '[', '{', ']', '}', ';', ':', ',', '.', '?', '/', '|', '`', '~'];
  static UsernameMinLength = 8;
  static UsernameMaxLength = 20;
  static UsernameMinSpecialChars = 1;
  static UsernameMinCapitalLetters = 1;

  static LengthMessage(fieldName: string) {
    return `${fieldName} must be between ${Validator.UsernameMinLength} and ${Validator.UsernameMaxLength} characters long`;
  }

  static SpecialCharMessage(fieldName: string) {
    return `A ${fieldName} must have ${Validator.UsernameMinSpecialChars} special characters`;
  }

  static CapitalLettersMessage(fieldName: string) {
    return `A ${fieldName} must have ${Validator.UsernameMinCapitalLetters} capital letters`;
  }
  static ValidateUsername(username: string): IValidatorResponse {
    let specialChars = 0;
    let capitalLetters = 0;
    // check username length
    if ( username.length < Validator.UsernameMinLength || username.length > Validator.UsernameMaxLength) {
      return {valid: false, reason: Validator.LengthMessage('username')};
    }
    for (let i = 0; i < username.length; i ++) {
      // check if for loop is still needed to run
      if (specialChars >= Validator.UsernameMinSpecialChars && capitalLetters >= Validator.UsernameMinCapitalLetters) {
        break;
      }
      // checks if char is uppercase
      if (username[i].toUpperCase() === username[i]) { capitalLetters++; }
      // checks if char is special character
      if (Validator.SpecialChars.indexOf(username[i])) {specialChars++; }
    }
    // checks for enough special chars
    if (specialChars < Validator.UsernameMinSpecialChars) {
      return {valid: false, reason: Validator.SpecialCharMessage('username')};
    }
    if (capitalLetters < Validator.UsernameMinCapitalLetters) {
      return {valid: false, reason: Validator.CapitalLettersMessage('username')};
    }
    return {valid: true};
  }
}
