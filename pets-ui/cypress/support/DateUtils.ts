// Date utility functions for test automation in PETS UI Cypress tests

export class DateUtils {
  /**
   * Get current date
   */
  static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Calculate date of birth for a given age in years
   * @param ageInYears - The age in years
   * @returns Date object representing the date of birth
   */
  static getDateOfBirthForAge(ageInYears: number): Date {
    const today = this.getCurrentDate();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - ageInYears);
    return birthDate;
  }

  /**
   * Calculate date of birth for a given age in months
   * Used for infants and young children under 2 years
   * @param ageInMonths - The age in months (e.g., 1, 6, 10, 18)
   * @returns Date object representing the date of birth
   *
   * @example
   * DateUtils.getDateOfBirthForAgeInMonths(10); // 10 months old
   * DateUtils.getDateOfBirthForAgeInMonths(1);  // 1 month old
   */
  static getDateOfBirthForAgeInMonths(ageInMonths: number): Date {
    if (ageInMonths < 0) {
      throw new Error("Age in months cannot be negative");
    }
    if (ageInMonths > 120) {
      throw new Error("For ages over 10 years (120 months), use getDateOfBirthForAge instead");
    }

    const today = this.getCurrentDate();
    const birthDate = new Date(today);
    birthDate.setMonth(today.getMonth() - ageInMonths);
    return birthDate;
  }

  /**
   * Calculate date of birth for an infant (under 12 months)
   * @param ageInMonths - Optional age in months, defaults to random age between 1-11 months
   * @returns Date object representing the infant's date of birth
   *
   * @example
   * DateUtils.getInfantDateOfBirth(6);  // 6 months old
   * DateUtils.getInfantDateOfBirth();   // Random 1-11 months
   */
  static getInfantDateOfBirth(ageInMonths?: number): Date {
    // If no age specified, generate random age between 1 and 11 months
    const age = ageInMonths ?? Math.floor(Math.random() * 11) + 1;

    // Ensure age is under 12 months
    if (age >= 12) {
      throw new Error(
        "Infant age must be under 12 months. Use getChildDateOfBirth for older children.",
      );
    }

    if (age < 0) {
      throw new Error("Age cannot be negative");
    }

    return this.getDateOfBirthForAgeInMonths(age);
  }

  /**
   * Calculate date of birth for a child (under 11 years old)
   * @param ageInYears - Optional age, defaults to random age between 2-10
   * @returns Date object representing the child's date of birth
   */
  static getChildDateOfBirth(ageInYears?: number): Date {
    // If no age specified, generate random age between 2 and 10
    const age = ageInYears ?? Math.floor(Math.random() * 9) + 2;

    // Ensure age is under 11
    if (age >= 11) {
      throw new Error("Child age must be under 11 years");
    }

    return this.getDateOfBirthForAge(age);
  }

  /**
   * Calculate date of birth for an adult (11 years or older)
   * @param ageInYears - Optional age, defaults to 30
   * @returns Date object representing the adult's date of birth
   */
  static getAdultDateOfBirth(ageInYears: number = 30): Date {
    if (ageInYears < 11) {
      throw new Error("Adult age must be 11 years or older");
    }
    return this.getDateOfBirthForAge(ageInYears);
  }

  /**
   * Format date as DD/MM/YYYY
   */
  static formatDateDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Normalize date format by removing preceeding zeros for comparison
   * Converts "05/12/2000" to "5/12/2000" and leaves "21/12/2000" as "21/12/2000"
   * Use this when comparing dates where the UI may display without leading zeros
   * @param dateString - Date string in DD/MM/YYYY or D/M/YYYY format
   * @returns Normalized date string without leading zeros
   */
  static normalizeDateForComparison(dateString: string): string {
    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString;

    const day = parseInt(parts[0], 10).toString();
    const month = parseInt(parts[1], 10).toString();
    const year = parts[2];

    return `${day}/${month}/${year}`;
  }

  /**
   * Get date components for form filling
   * @param date - Date object
   * @returns Object with day, month, year as strings
   */
  static getDateComponents(date: Date): { day: string; month: string; year: string } {
    return {
      day: String(date.getDate()).padStart(2, "0"),
      month: String(date.getMonth() + 1).padStart(2, "0"),
      year: String(date.getFullYear()),
    };
  }

  /**
   * Calculate age from date of birth in years
   * @param dateOfBirth - Date object or date string
   * @returns Age in years
   */
  static calculateAge(dateOfBirth: Date | string): number {
    const today = this.getCurrentDate();
    const birthDate = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Calculate age from date of birth in months
   * Useful for infants and young children
   * @param dateOfBirth - Date object or date string
   * @returns Age in months
   *
   * @example
   * const baby = DateUtils.getInfantDateOfBirth(6);
   * DateUtils.calculateAgeInMonths(baby); // Returns: 6
   */
  static calculateAgeInMonths(dateOfBirth: Date | string): number {
    const today = this.getCurrentDate();
    const birthDate = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;

    const yearsDiff = today.getFullYear() - birthDate.getFullYear();
    const monthsDiff = today.getMonth() - birthDate.getMonth();
    const daysDiff = today.getDate() - birthDate.getDate();

    let totalMonths = yearsDiff * 12 + monthsDiff;

    // Adjust if birthday hasn't occurred yet this month
    if (daysDiff < 0) {
      totalMonths--;
    }

    return totalMonths;
  }

  /**
   * Get date of birth components for a specific age
   * Convenience method that combines getDateOfBirthForAge and getDateComponents
   */
  static getDOBComponentsForAge(ageInYears: number): { day: string; month: string; year: string } {
    const dob = this.getDateOfBirthForAge(ageInYears);
    return this.getDateComponents(dob);
  }

  /**
   * Get date of birth components for a specific age in months
   * Convenience method for infants and young children
   *
   * @example
   * const babyDOB = DateUtils.getDOBComponentsForAgeInMonths(10);
   * // Returns: { day: "02", month: "02", year: "2025" } if today is Dec 9, 2025
   */
  static getDOBComponentsForAgeInMonths(ageInMonths: number): {
    day: string;
    month: string;
    year: string;
  } {
    const dob = this.getDateOfBirthForAgeInMonths(ageInMonths);
    return this.getDateComponents(dob);
  }

  /**
   * Get infant date of birth components
   * Convenience method for infant scenarios
   *
   * @example
   * const infantDOB = DateUtils.getInfantDOBComponents(6);
   * // Returns: { day: "09", month: "06", year: "2025" } for 6-month-old
   */
  static getInfantDOBComponents(ageInMonths?: number): {
    day: string;
    month: string;
    year: string;
  } {
    const dob = this.getInfantDateOfBirth(ageInMonths);
    return this.getDateComponents(dob);
  }

  /**
   * Get child date of birth components
   * Convenience method for child scenarios
   */
  static getChildDOBComponents(ageInYears?: number): { day: string; month: string; year: string } {
    const dob = this.getChildDateOfBirth(ageInYears);
    return this.getDateComponents(dob);
  }

  /**
   * Get adult date of birth components
   * Convenience method for adult scenarios
   */
  static getAdultDOBComponents(ageInYears: number = 30): {
    day: string;
    month: string;
    year: string;
  } {
    const dob = this.getAdultDateOfBirth(ageInYears);
    return this.getDateComponents(dob);
  }

  /**
   * Get date in the past
   * @param yearsAgo - Number of years in the past
   * @param monthsAgo - Optional number of months in the past
   * @param daysAgo - Optional number of days in the past
   */
  static getDateInPast(yearsAgo: number = 0, monthsAgo: number = 0, daysAgo: number = 0): Date {
    const date = this.getCurrentDate();
    date.setFullYear(date.getFullYear() - yearsAgo);
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  /**
   * Get date in the future
   * @param yearsForward - Number of years in the future
   * @param monthsForward - Optional number of months in the future
   * @param daysForward - Optional number of days in the future
   */
  static getDateInFuture(
    yearsForward: number = 0,
    monthsForward: number = 0,
    daysForward: number = 0,
  ): Date {
    const date = this.getCurrentDate();
    date.setFullYear(date.getFullYear() + yearsForward);
    date.setMonth(date.getMonth() + monthsForward);
    date.setDate(date.getDate() + daysForward);
    return date;
  }

  /**
   * Get passport expiry date (typically 10 years from issue for adults, 5 years for children)
   * @param issueDate - Date when passport was issued
   * @param isChild - Whether this is a child's passport
   */
  static getPassportExpiryDate(issueDate: Date, isChild: boolean = false): Date {
    const yearsValid = isChild ? 5 : 10;
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + yearsValid);
    return expiryDate;
  }

  /**
   * Format date for Summary Page style display (e.g., "4 December 2025")
   */
  static formatDateGOVUK(date: Date): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  /**
   * Convert DD/MM/YYYY format to GOV.UK format (e.g., "17/12/2000" to "17 December 2000")
   * @param dateString - Date string in DD/MM/YYYY format
   * @returns Date string in GOV.UK format (e.g., "17 December 2000")
   *
   * @example
   * DateUtils.convertDDMMYYYYtoGOVUK("17/12/2000"); // Returns: "17 December 2000"
   * DateUtils.convertDDMMYYYYtoGOVUK("01/01/2025"); // Returns: "1 January 2025"
   */
  static convertDDMMYYYYtoGOVUK(dateString: string): string {
    const parts = dateString.split("/");
    if (parts.length !== 3) {
      throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY format.`);
    }

    const day = parseInt(parts[0], 10); // Remove leading zeros
    const month = parseInt(parts[1], 10);
    const year = parts[2];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (month < 1 || month > 12) {
      throw new Error(`Invalid month: ${month}. Must be between 1 and 12.`);
    }

    return `${day} ${months[month - 1]} ${year}`;
  }

  /**
   * Check if a person is a child (under 11) based on date of birth
   */
  static isChild(dateOfBirth: Date | string): boolean {
    return this.calculateAge(dateOfBirth) < 11;
  }

  /**
   * Check if a person is an infant (under 12 months) based on date of birth
   */
  static isInfant(dateOfBirth: Date | string): boolean {
    return this.calculateAgeInMonths(dateOfBirth) < 12;
  }

  /**
   * Check if a person is pregnant-eligible (between 11-55 years old, female)
   * Age range based on typical TB screening requirements
   */
  static isPregnantEligibleAge(dateOfBirth: Date | string): boolean {
    const age = this.calculateAge(dateOfBirth);
    return age >= 11 && age <= 55;
  }

  // =====================================================
  // TEST-FRIENDLY DATE METHODS
  // These methods generate dates optimized for test stability
  // =====================================================

  /**
   * Get test-friendly passport dates that are ALWAYS VALID
   * Use this instead of real-world passport validity logic in tests
   *
   * @returns Object with issue and expiry date components
   *
   * @example
   * const { issueDate, expiryDate } = DateUtils.getValidPassportDates();
   */
  static getValidPassportDates(): {
    issueDate: DateComponents;
    expiryDate: DateComponents;
  } {
    const issueDate = this.getDateInPast(1); // 1 year ago (recent and realistic)
    const expiryDate = this.getDateInFuture(10); // 10 years from today (always valid)

    return {
      issueDate: this.getDateComponents(issueDate),
      expiryDate: this.getDateComponents(expiryDate),
    };
  }

  /**
   * Get test-friendly passport dates with custom validity period
   *
   * @param yearsAgoIssued - How many years ago passport was issued (default: 1)
   * @param yearsUntilExpiry - How many years until expiry from today (default: 10)
   */
  static getValidPassportDatesCustom(
    yearsAgoIssued: number = 1,
    yearsUntilExpiry: number = 10,
  ): {
    issueDate: DateComponents;
    expiryDate: DateComponents;
  } {
    const issueDate = this.getDateInPast(yearsAgoIssued);
    const expiryDate = this.getDateInFuture(yearsUntilExpiry);

    return {
      issueDate: this.getDateComponents(issueDate),
      expiryDate: this.getDateComponents(expiryDate),
    };
  }

  /**
   * Get test-friendly X-ray date within screening window
   */
  static getValidXrayDate(daysAgo: number = 30): DateComponents {
    if (daysAgo > 90) {
      throw new Error("X-ray date should be within 90 days for typical screening windows");
    }
    const xrayDate = this.getDateInPast(0, 0, daysAgo);
    return this.getDateComponents(xrayDate);
  }

  /**
   * Get test-friendly sputum sample dates
   */
  static getValidSputumSampleDates(startDaysAgo: number = 60): {
    sample1: DateComponents;
    sample1Formatted: string;
    sample2: DateComponents;
    sample2Formatted: string;
    sample3: DateComponents;
    sample3Formatted: string;
  } {
    const sputum1 = this.getDateInPast(0, 0, startDaysAgo);
    const sputum2 = this.getDateInPast(0, 0, startDaysAgo - 1);
    const sputum3 = this.getDateInPast(0, 0, startDaysAgo - 2);

    return {
      sample1: this.getDateComponents(sputum1),
      sample1Formatted: this.formatDateGOVUK(sputum1),
      sample2: this.getDateComponents(sputum2),
      sample2Formatted: this.formatDateGOVUK(sputum2),
      sample3: this.getDateComponents(sputum3),
      sample3Formatted: this.formatDateGOVUK(sputum3),
    };
  }

  /**
   * Get test-friendly screening date
   */
  static getValidScreeningDate(daysAgo: number = 30): DateComponents {
    const screeningDate = this.getDateInPast(0, 0, daysAgo);
    return this.getDateComponents(screeningDate);
  }

  /**
   * Get complete set of test-friendly dates for an INFANT applicant scenario
   * For babies under 12 months old
   *
   * Ensures passport is issued AFTER the infant's date of birth
   *
   * @param infantAgeInMonths - Age of infant in months (1-11)
   * @returns Object with all necessary date components
   *
   * @example
   * const testDates = DateUtils.getInfantApplicantTestDates(6);  // 6-month-old baby
   * const testDates = DateUtils.getInfantApplicantTestDates(1);  // 1-month-old baby
   */
  static getInfantApplicantTestDates(infantAgeInMonths: number) {
    if (infantAgeInMonths >= 12) {
      throw new Error("Use getChildApplicantTestDates for children 12 months (1 year) or older");
    }
    if (infantAgeInMonths < 0) {
      throw new Error("Age in months cannot be negative");
    }

    // Get infant's date of birth
    const dob = this.getInfantDateOfBirth(infantAgeInMonths);

    // Calculate passport dates AFTER infant's birth
    // For infants, passport is typically issued within days/weeks of birth
    const passportIssueDate = new Date(dob);
    passportIssueDate.setDate(passportIssueDate.getDate() + 7); // 7 days after birth

    // Child passports expire after 5 years
    const passportExpiryDate = this.getPassportExpiryDate(passportIssueDate, true);

    // Other dates remain the same
    const screening = this.getValidScreeningDate(31);
    const xray = this.getValidXrayDate(30);
    const sputum = this.getValidSputumSampleDates(60);

    return {
      infantAgeInMonths,
      ageInYears: 0,
      birthDate: this.getDateComponents(dob),
      birthDateFormatted: this.normalizeDateForComparison(this.formatDateDDMMYYYY(dob)),
      birthDateGOVUKFormat: this.formatDateGOVUK(dob),
      passportIssueDate: this.getDateComponents(passportIssueDate),
      passportExpiryDate: this.getDateComponents(passportExpiryDate),
      screeningDate: screening,
      screeningDateGOVUKFormat: this.formatDateGOVUK(this.getDateInPast(0, 0, 31)),
      xrayDate: xray,
      sputumSample1Date: sputum.sample1,
      sputumSample1DateFormatted: sputum.sample1Formatted,
      sputumSample2Date: sputum.sample2,
      sputumSample2DateFormatted: sputum.sample2Formatted,
      sputumSample3Date: sputum.sample3,
      sputumSample3DateFormatted: sputum.sample3Formatted,
    };
  }

  /**
   * Get complete set of test-friendly dates for a child applicant scenario
   * For children 1-10 years old
   *
   * Ensures passport is issued AFTER the child's date of birth
   *
   * @param childAge - Age of child in years (1-10)
   */
  static getChildApplicantTestDates(childAge: number = 6) {
    if (childAge >= 11) {
      throw new Error("Use getAdultApplicantTestDates for applicants 11 or older");
    }
    if (childAge < 1) {
      throw new Error(
        "Use getInfantApplicantTestDates for infants under 1 year (specify age in months)",
      );
    }

    const dob = this.getChildDateOfBirth(childAge);

    // For young children, passport should be issued after birth
    // For 1-2 year olds: issue 1-3 months after birth
    // For older children: can be more recent (within last year)
    const passportIssueDate = new Date(dob);

    if (childAge <= 2) {
      // For very young children, passport issued 1-3 months after birth
      const monthsAfterBirth = Math.floor(Math.random() * 3) + 1; // 1-3 months
      passportIssueDate.setMonth(passportIssueDate.getMonth() + monthsAfterBirth);
    } else {
      // For older children (3-10 years), passport can be more recent
      // Issue anywhere from 1 month to 1 year ago, but ensure it's after birth
      const monthsAgo = Math.floor(Math.random() * 12) + 1; // 1-12 months ago
      const issueDate = this.getDateInPast(0, monthsAgo, 0);

      // Ensure it's after DOB
      if (issueDate > dob) {
        passportIssueDate.setTime(issueDate.getTime());
      } else {
        // If random date is before birth, issue 6 months after birth
        passportIssueDate.setMonth(passportIssueDate.getMonth() + 6);
      }
    }

    // Child passports expire after 5 years
    const passportExpiryDate = this.getPassportExpiryDate(passportIssueDate, true);

    const screening = this.getValidScreeningDate(31);
    const xray = this.getValidXrayDate(30);
    const sputum = this.getValidSputumSampleDates(60);

    return {
      childAge,
      birthDate: this.getDateComponents(dob),
      birthDateFormatted: this.normalizeDateForComparison(this.formatDateDDMMYYYY(dob)),
      birthDateGOVUKFormat: this.formatDateGOVUK(dob),
      passportIssueDate: this.getDateComponents(passportIssueDate),
      passportExpiryDate: this.getDateComponents(passportExpiryDate),
      screeningDate: screening,
      screeningDateGOVUKFormat: this.formatDateGOVUK(this.getDateInPast(0, 0, 31)),
      xrayDate: xray,
      sputumSample1Date: sputum.sample1,
      sputumSample1DateFormatted: sputum.sample1Formatted,
      sputumSample2Date: sputum.sample2,
      sputumSample2DateFormatted: sputum.sample2Formatted,
      sputumSample3Date: sputum.sample3,
      sputumSample3DateFormatted: sputum.sample3Formatted,
    };
  }

  /**
   * Get complete set of test-friendly dates for an adult applicant scenario
   */
  static getAdultApplicantTestDates(adultAge: number = 30) {
    if (adultAge < 11) {
      throw new Error(
        "Use getChildApplicantTestDates or getInfantApplicantTestDates for applicants under 11",
      );
    }

    const dob = this.getAdultDateOfBirth(adultAge);
    const passport = this.getValidPassportDates();
    const screening = this.getValidScreeningDate(31);
    const xray = this.getValidXrayDate(30);
    const sputum = this.getValidSputumSampleDates(60);

    return {
      adultAge,
      birthDate: this.getDateComponents(dob),
      birthDateFormatted: this.normalizeDateForComparison(this.formatDateDDMMYYYY(dob)),
      birthDateGOVUKFormat: this.formatDateGOVUK(dob),
      passportIssueDate: passport.issueDate,
      passportExpiryDate: passport.expiryDate,
      screeningDate: screening,
      screeningDateGOVUKFormat: this.formatDateGOVUK(this.getDateInPast(0, 0, 31)),
      xrayDate: xray,
      sputumSample1Date: sputum.sample1,
      sputumSample1DateFormatted: sputum.sample1Formatted,
      sputumSample2Date: sputum.sample2,
      sputumSample2DateFormatted: sputum.sample2Formatted,
      sputumSample3Date: sputum.sample3,
      sputumSample3DateFormatted: sputum.sample3Formatted,
    };
  }
}

// Type definitions for better TypeScript support
export interface DateComponents {
  day: string;
  month: string;
  year: string;
}

export interface ApplicantDateData {
  birthDate: DateComponents;
  passportIssueDate: DateComponents;
  passportExpiryDate: DateComponents;
}

/**
 * Helper function to generate complete applicant date data
 * @deprecated Use DateUtils.getChildApplicantTestDates(), getInfantApplicantTestDates(), or getAdultApplicantTestDates() instead
 */
export function generateApplicantDates(age?: number, isChild: boolean = false): ApplicantDateData {
  const birthDate = isChild
    ? DateUtils.getChildDateOfBirth(age)
    : DateUtils.getDateOfBirthForAge(age || 30);

  const { issueDate, expiryDate } = DateUtils.getValidPassportDates();

  return {
    birthDate: DateUtils.getDateComponents(birthDate),
    passportIssueDate: issueDate,
    passportExpiryDate: expiryDate,
  };
}
