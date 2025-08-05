import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { searchableFieldsInUser } from "./user.constants";
import {
  IAuthProviders,
  IRoleChange,
  IsActive,
  IUser,
  IVehicle,
  Role,
  RoleStatus,
} from "./user.interface";
import { RoleChange, User } from "./user.model";
import { createToken } from "../../utils/createUsreToken";
import { steCookies } from "../../utils/setCookies";

const createUser = async (payload: Partial<IUser>) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new AppError(400, "User already exist");
  }

  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: payload.email as string,
  };

  const user = await User.create({
    ...payload,
    auth: [authProvider],
  });

  return {
    data: user,
  };
};

const getAllUser = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(User.find(), query);
  const user = queryModel
    .filter()
    .search(searchableFieldsInUser)
    .sort()
    .fields()
    .paginate();

  let [data, meta] = await Promise.all([
    user.build().select("-password"),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (_id: string) => {
  const user = await User.findById(_id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    data: user,
  };
};

const getMe = async (_id: string) => {
  const user = await User.findById(_id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    data: user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(403, "Your are forbidden to update other users info.");
    }
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(404, "User not found.");
  }

  if (
    payload.role ||
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified
  ) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(403, "Your are forbidden to update role.");
    }
  }

  if (
    !isUserExist.isVerified ||
    isUserExist.isActive === IsActive.INACTIVE ||
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isDeleted
  ) {
    throw new AppError(
      400,
      "Somethig went wrong. Please contact our tema. User either 'inactive' or 'blocked' or 'deleted' or 'not varified'"
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { data: newUpdatedUser };
};

const getAllRoleChangeRequest = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(RoleChange.find(), query);
  const requsetedChanges = queryModel.sort().paginate();

  const [data, meta] = await Promise.all([
    requsetedChanges.build(),
    queryModel.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const RoleChangeRequest = async (
  payload: { reqRole: string; vehicle: IVehicle },
  decodedToken: JwtPayload
) => {
  const isRoleRequestExist = await RoleChange.find({
    userId: decodedToken.userId,
  });

  if (
    isRoleRequestExist.some((status) => status.status === RoleStatus.PENDING)
  ) {
    throw new AppError(400, "Your previous request pending.");
  }

  if (payload.reqRole === Role.ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(400, "You are already an Admin");
  }

  if (
    (payload.reqRole === Role.USER || payload.reqRole === Role.DRIVER) &&
    (decodedToken.role === Role.DRIVER || decodedToken.role === Role.ADMIN)
  ) {
    throw new AppError(400, "Driver or Admin can't ba Driver or User again.");
  }

  if (payload.reqRole === Role.DRIVER && !payload.vehicle) {
    throw new AppError(400, "Driver must have a vehicle.");
  }

  const changeRequestPayload: IRoleChange = {
    userId: decodedToken.userId,
    currentRole: decodedToken.role,
    requestedRole: payload.reqRole as Role,
    status: RoleStatus.PENDING,
    Vehicle: payload.reqRole === "DRIVER" ? payload.vehicle : null,
  };

  const changedRoleRequest = await RoleChange.create(changeRequestPayload);

  return {
    data: changedRoleRequest,
  };
};

const updateRole = async (_id: string, payload: string) => {
  if (
    ![RoleStatus.ACCEPTED, RoleStatus.CANCELED].includes(payload as RoleStatus)
  ) {
    throw new AppError(
      400,
      `Request miss matched. Request should be either ${RoleStatus.ACCEPTED} or ${RoleStatus.CANCELED}`
    );
  }

  const session = await RoleChange.startSession();
  session.startTransaction();

  try {
    const updatedRole = await RoleChange.findByIdAndUpdate(
      _id,
      {
        status: payload,
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedRole) {
      throw new AppError(400, "Faild to updated user Role.");
    }

    if (updatedRole.status === RoleStatus.ACCEPTED) {
      const newUser = await User.findByIdAndUpdate(
        updatedRole.userId,
        {
          role: updatedRole.requestedRole,
          Vehicle:
            updatedRole.requestedRole === Role.DRIVER
              ? updatedRole.Vehicle
              : null,
        },
        { new: true, runValidators: true, session }
      ).select("-password");

      if (!newUser) {
        throw new AppError(400, "Failed to create token. User not found.");
      }

      await session.commitTransaction();
      session.endSession();
      return {
        data: newUser,
      };
    }

    if (updatedRole.status === RoleStatus.CANCELED) {
      await session.commitTransaction();
      session.endSession();
      return { data: "Role update request rejected by admin" };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log(error);

    throw new AppError(400, "Faild to update role.");
  }
};

const requestRoleStats = async () => {
  const pendingRequestPromise = RoleChange.find({
    status: RoleStatus.PENDING,
  }).countDocuments();
  const acceptRequestPromise = RoleChange.find({
    status: RoleStatus.ACCEPTED,
  }).countDocuments();
  const cancleRequestPromise = RoleChange.find({
    status: RoleStatus.CANCELED,
  }).countDocuments();

  const [pendingRequest, acceptRequest, cancleRequest] = await Promise.all([
    pendingRequestPromise,
    acceptRequestPromise,
    cancleRequestPromise,
  ]);

  return {
    data: {
      pendingRequest,
      acceptRequest,
      cancleRequest,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUser,
  getSingleUser,
  getMe,
  updateUser,
  RoleChangeRequest,
  updateRole,
  getAllRoleChangeRequest,
  requestRoleStats,
};
