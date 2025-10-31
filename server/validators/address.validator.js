import { body } from 'express-validator';

export const createAddressValidator = [
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  body('village')
    .notEmpty()
    .withMessage('Village is required'),
  body('detail_address')
    .notEmpty()
    .withMessage('Detail address is required'),
];

export const updateAddressValidator = [
  body('city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty if provided'),
  body('village')
    .optional()
    .notEmpty()
    .withMessage('Village cannot be empty if provided'),
  body('detail_address')
    .optional()
    .notEmpty()
    .withMessage('Detail address cannot be empty if provided'),
];