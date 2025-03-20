import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { courseController } from './course.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-course',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  courseController.createCourse,
);

router.get(
  '/:id',
  auth('student', 'faculty', 'admin'),
  courseController.getSingleCourse,
);
router.get(
  '/',
  auth('student', 'faculty', 'admin'),
  courseController.getAllCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseController.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  courseController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  courseController.removeFacultiesFromCourse,
);

router.delete('/:id', auth('admin'), courseController.deleteCourse);

export const CourseRoutes = router;
