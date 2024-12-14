import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'students are retrieve successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student is retrieve successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDb(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student is updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student is deleted successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
