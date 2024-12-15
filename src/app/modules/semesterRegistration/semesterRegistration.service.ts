import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemister/academicSemester.Model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //check if there any registered semester that is already 'UPCOMING'|'ONGOING
  const isThereAnyOngoingOrUpcomingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyOngoingOrUpcomingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isThereAnyOngoingOrUpcomingSemester.status} registered semester!`,
    );
  }

  const SemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester: academicSemester,
  });
  if (SemesterRegistrationExists) {
    throw new AppError(httpStatus.CONFLICT, 'Semester is already registered');
  }

  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if  the registered semester is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found');
  }

  //if the registered semester registration is ended, we will not update
  const currentSemesterStatus = isSemesterRegistrationExists.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `this semester registration is already ${currentSemesterStatus}`,
    );
  }

  // UPCOMING-->ONGOING-->ENDED
  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you cannot directly change status from UPCOMING to ENDED`,
    );
  }

  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you cannot directly change status from ONGOING to UPCOMING`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
