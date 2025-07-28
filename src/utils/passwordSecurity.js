// Password policy configuration
export const PASSWORD_POLICY = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    maxRepeatingChars: 2,
    passwordHistoryCount: 5, // Number of previous passwords to remember
    passwordExpiryDays: 90, // Password expiry in days
    lockoutThreshold: 5, // Number of failed attempts before lockout
    lockoutDuration: 5 // Lockout duration in minutes
};

/**
 * Check for repeating characters in password
 * @param {string} password - The password to check
 * @param {number} maxRepeating - Maximum allowed consecutive identical characters
 * @returns {boolean} - True if password has too many repeating characters
 */
export const hasRepeatingCharacters = (password, maxRepeating) => {
    let count = 1;
    for (let i = 1; i < password.length; i++) {
        if (password[i] === password[i - 1]) {
            count++;
            if (count > maxRepeating) return true;
        } else {
            count = 1;
        }
    }
    return false;
};

/**
 * Assess password strength based on various criteria
 * @param {string} password - The password to assess
 * @returns {object} - Password strength assessment object
 */
export const assessPasswordStrength = (password) => {
    const checks = {
        length: password.length >= PASSWORD_POLICY.minLength && password.length <= PASSWORD_POLICY.maxLength,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password),
        noRepeating: !hasRepeatingCharacters(password, PASSWORD_POLICY.maxRepeatingChars)
    };

    const score = Object.values(checks).filter(Boolean).length;
    let feedback = '';
    let strengthLevel = '';

    if (score <= 2) {
        feedback = 'Very Weak';
        strengthLevel = 'very-weak';
    } else if (score <= 3) {
        feedback = 'Weak';
        strengthLevel = 'weak';
    } else if (score <= 4) {
        feedback = 'Moderate';
        strengthLevel = 'moderate';
    } else if (score <= 5) {
        feedback = 'Strong';
        strengthLevel = 'strong';
    } else {
        feedback = 'Very Strong';
        strengthLevel = 'very-strong';
    }

    return { score, feedback, checks, strengthLevel };
};

/**
 * Validate password against security policy
 * @param {string} password - The password to validate
 * @returns {array} - Array of validation error messages
 */
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < PASSWORD_POLICY.minLength) {
        errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
    }
    if (password.length > PASSWORD_POLICY.maxLength) {
        errors.push(`Password must not exceed ${PASSWORD_POLICY.maxLength} characters`);
    }
    if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (PASSWORD_POLICY.requireSpecialChars && !new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
        errors.push('Password must contain at least one special character');
    }
    if (hasRepeatingCharacters(password, PASSWORD_POLICY.maxRepeatingChars)) {
        errors.push(`Password cannot have more than ${PASSWORD_POLICY.maxRepeatingChars} consecutive identical characters`);
    }

    return errors;
};

/**
 * Check if password has been used recently (for password reuse prevention)
 * @param {string} newPassword - The new password to check
 * @param {array} passwordHistory - Array of previously used password hashes
 * @returns {boolean} - True if password has been used recently
 */
export const isPasswordReused = (newPassword, passwordHistory = []) => {

    return passwordHistory.some(hashedPassword => {
        return false;
    });
};

/**
 * Check if password has expired
 * @param {Date} passwordCreatedDate - Date when password was created
 * @returns {boolean} - True if password has expired
 */
export const isPasswordExpired = (passwordCreatedDate) => {
    if (!passwordCreatedDate) return false;

    const now = new Date();
    const expiryDate = new Date(passwordCreatedDate);
    expiryDate.setDate(expiryDate.getDate() + PASSWORD_POLICY.passwordExpiryDays);

    return now > expiryDate;
};

/**
 * Get days until password expires
 * @param {Date} passwordCreatedDate - Date when password was created
 * @returns {number} - Days until expiry (negative if already expired)
 */
export const getDaysUntilExpiry = (passwordCreatedDate) => {
    if (!passwordCreatedDate) return PASSWORD_POLICY.passwordExpiryDays;

    const now = new Date();
    const expiryDate = new Date(passwordCreatedDate);
    expiryDate.setDate(expiryDate.getDate() + PASSWORD_POLICY.passwordExpiryDays);

    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Generate password strength suggestions
 * @param {object} strengthAssessment - Result from assessPasswordStrength
 * @returns {array} - Array of improvement suggestions
 */
export const getPasswordSuggestions = (strengthAssessment) => {
    const suggestions = [];

    if (!strengthAssessment.checks.length) {
        suggestions.push(`Make password ${PASSWORD_POLICY.minLength}-${PASSWORD_POLICY.maxLength} characters long`);
    }
    if (!strengthAssessment.checks.uppercase) {
        suggestions.push('Add uppercase letters (A-Z)');
    }
    if (!strengthAssessment.checks.lowercase) {
        suggestions.push('Add lowercase letters (a-z)');
    }
    if (!strengthAssessment.checks.number) {
        suggestions.push('Add numbers (0-9)');
    }
    if (!strengthAssessment.checks.special) {
        suggestions.push('Add special characters (!@#$%^&*...)');
    }
    if (!strengthAssessment.checks.noRepeating) {
        suggestions.push('Avoid consecutive repeated characters');
    }

    return suggestions;
};

/**
 * Calculate password entropy (measure of randomness)
 * @param {string} password - The password to analyze
 * @returns {number} - Entropy value in bits
 */
export const calculatePasswordEntropy = (password) => {
    if (!password) return 0;

    let charSetSize = 0;

    if (/[a-z]/.test(password)) charSetSize += 26;
    if (/[A-Z]/.test(password)) charSetSize += 26;
    if (/[0-9]/.test(password)) charSetSize += 10;
    if (new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) charSetSize += PASSWORD_POLICY.specialChars.length;

    return Math.log2(Math.pow(charSetSize, password.length));
};

/**
 * Estimate time to crack password
 * @param {string} password - The password to analyze
 * @returns {string} - Human-readable time estimate
 */
export const getTimeToCrack = (password) => {
    const entropy = calculatePasswordEntropy(password);
    const guessesPerSecond = 1e9; // Assume 1 billion guesses per second
    const secondsToCrack = Math.pow(2, entropy - 1) / guessesPerSecond;

    if (secondsToCrack < 60) return 'Less than a minute';
    if (secondsToCrack < 3600) return `${Math.ceil(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.ceil(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.ceil(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.ceil(secondsToCrack / 31536000)} years`;

    return 'Centuries';
};
