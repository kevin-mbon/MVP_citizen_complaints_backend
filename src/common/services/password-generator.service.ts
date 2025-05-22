
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordGeneratorService {
  /**
   * Generates a random password of specified length
   * @param length Minimum length of the password (default: 8)
   * @returns A random password string
   */
  generateRandomPassword(length = 8): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+=-';

    const allChars = lowercase + uppercase + numbers + specialChars;

    // Ensure at least one character from each category
    let password =
      lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
      uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
      numbers.charAt(Math.floor(Math.random() * numbers.length)) +
      specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill the rest with the password
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password characters
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }
}