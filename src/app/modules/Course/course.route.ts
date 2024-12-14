import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { courseController } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  courseController.createCourse,
);

router.get('/:id', courseController.getSingleCourse);
router.get('/', courseController.getAllCourse);

router.patch(
  '/:id',
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

router.delete('/:id', courseController.deleteCourse);

export const CourseRoutes = router;
