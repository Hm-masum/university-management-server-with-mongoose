import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not Found! ');
    }

    // checking if the user is already deleted
    const isDeletedUser = user?.isDeleted;
    if (isDeletedUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted! ');
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked! ');
    }

    // check JWT token Issued Before Password Changed
    if (
      user.passwordChangeAt &&
      (await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangeAt,
        iat as number,
      ))
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Check if role is authorized
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();

    // jwt.verify(
    //   token,
    //   config.jwt_access_secret as string,
    //   function (err, decoded) {
    //     if (err) {
    //       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    //     }

    //     const role = (decoded as JwtPayload).role;
    //     if (requiredRoles && !requiredRoles.includes(role)) {
    //       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    //     }

    //     req.user = decoded as JwtPayload;
    //     next();
    //   },
    // );
  });
};

export default auth;
