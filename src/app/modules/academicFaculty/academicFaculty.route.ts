import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);
router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
