import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: 'AcademicFaculty' },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDeptExist = await AcademicDepartment.findOne({ name: this.name });
  if (isDeptExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Department is already exist',
    );
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDeptExist = await AcademicDepartment.findOne(query);
  if (!isDeptExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Department does not exist');
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
