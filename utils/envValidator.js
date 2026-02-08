/**
 * Environment Configuration Validator
 * Validates critical environment variables on startup
 */

import logger from './logger.js';

const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URL',
    'JWT_SECRET',
    'PORT',
  ];

  const warnings = [];
  const errors = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Optional but recommended
  const optionalEnvVars = [
    'BREVO_API_KEY',
    'BREVO_SENDER_EMAIL',
    'BRAINTREE_MERCHANT_ID',
    'CLIENT_URL',
  ];

  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable not set: ${envVar}`);
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => logger.warn(warning));
  }

  // Exit on critical errors
  if (errors.length > 0) {
    errors.forEach(error => logger.error(error));
    process.exit(1);
  }

  logger.info('✅ Environment validation successful');
};

export default validateEnv;
