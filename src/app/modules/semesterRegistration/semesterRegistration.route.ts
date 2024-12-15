import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
