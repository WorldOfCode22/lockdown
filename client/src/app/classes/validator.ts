export interface IValidatorResponse {
  valid: boolean;
  reason?: string;
}

export abstract class Validator {
  static SpecialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=',
   '[', '{', ']', '}', ';', ':', ',', '.', '?', '/', '|', '`', '~'];
  static UsernameMinLength = 8;
  static UsernameMaxLength = 20;
  static UsernameMinSpecialChars = 0;
  static UsernameMinCapitalLetters = 0;
  static PasswordMinLength = 8;
  static PasswordMaxLength = 20;
  static PasswordMinSpecialChars = 1;
  static PasswordMinCapitalLetters = 1;

  static LengthMessage(fieldName: string, min: number, max: number) {
    return `${fieldName} must be between ${min} and ${max} characters long`;
  }

  static SpecialCharMessage(fieldName: string, min: number) {
    return `A ${fieldName} must have ${min} special characters`;
  }

  static CapitalLettersMessage(fieldName: string, min: number) {
    return `A ${fieldName} must have ${min} capital letters`;
  }
  static ValidateUsername(username: string): IValidatorResponse {
    let specialChars = 0;
    let capitalLetters = 0;
    // check username length
    if ( username.length < Validator.UsernameMinLength || username.length > Validator.UsernameMaxLength) {
      return {valid: false, reason: Validator.LengthMessage('username', Validator.UsernameMinLength, Validator.UsernameMaxLength)};
    }
    for (let i = 0; i < username.length; i ++) {
      // check if for loop is still needed to run
      if (specialChars >= Validator.UsernameMinSpecialChars && capitalLetters >= Validator.UsernameMinCapitalLetters) {
        break;
      }
      // checks if char is uppercase
      if (username[i].toUpperCase() === username[i]) { capitalLetters++; }
      // checks if char is special character
      if (Validator.SpecialChars.indexOf(username[i]) > -1) {specialChars++; }
    }
    // checks for enough special chars
    if (specialChars < Validator.UsernameMinSpecialChars) {
      return {valid: false, reason: Validator.SpecialCharMessage('username', Validator.UsernameMinSpecialChars)};
    }
    if (capitalLetters < Validator.UsernameMinCapitalLetters) {
      return {valid: false, reason: Validator.CapitalLettersMessage('username', Validator.UsernameMinCapitalLetters)};
    }
    return {valid: true};
  }
  static ValidatePassword(password: string): IValidatorResponse {
    let specialChars = 0;
    let capitalLetters = 0;
    // check username length
    if ( password.length < Validator.PasswordMinLength || password.length > Validator.PasswordMaxLength) {
      return {valid: false, reason: Validator.LengthMessage('password', Validator.PasswordMinLength, Validator.PasswordMaxLength)};
    }
    for (let i = 0; i < password.length; i ++) {
      // check if for loop is still needed to run
      if (specialChars >= Validator.PasswordMinSpecialChars && capitalLetters >= Validator.PasswordMinCapitalLetters) {
        break;
      }
      // checks if char is uppercase
      if (password[i].toUpperCase() === password[i]) { capitalLetters++; }
      // checks if char is special character
      if (Validator.SpecialChars.indexOf(password[i]) > -1) {specialChars++; }
    }
    // checks for enough special chars
    if (specialChars < Validator.PasswordMinSpecialChars) {
      return {valid: false, reason: Validator.SpecialCharMessage('password', Validator.PasswordMinSpecialChars)};
    }
    if (capitalLetters < Validator.PasswordMinCapitalLetters) {
      return {valid: false, reason: Validator.CapitalLettersMessage('password', Validator.PasswordMinCapitalLetters)};
    }
    return {valid: true};
  }

  static ValidateProviderNameInput(input: string) {
    if (input.length > 0) {return true; }
    return false;
  }

  static ValidateProviderPasswordInput(input: string) {
    if (input.length > 0) {return true; }
    return false;
  }
}
