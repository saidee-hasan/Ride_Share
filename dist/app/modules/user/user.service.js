"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = require("../../errorHelpers/AppError");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_constants_1 = require("./user.constants");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError_1.AppError(400, "User already exist");
    }
    const authProvider = {
        provider: "credentials",
        providerId: payload.email,
    };
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { auth: [authProvider] }));
    return {
        data: user,
    };
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryModel = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const user = queryModel
        .filter()
        .search(user_constants_1.searchableFieldsInUser)
        .sort()
        .fields()
        .paginate();
    let [data, meta] = yield Promise.all([
        user.build().select("-password"),
        queryModel.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(_id).select("-password");
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    return {
        data: user,
    };
});
const getMe = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(_id).select("-password");
    if (!user) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    return {
        data: user,
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.AppError(403, "Your are forbidden to update other users info.");
        }
    }
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.AppError(404, "User not found.");
    }
    if (payload.role ||
        payload.isActive ||
        payload.isDeleted ||
        payload.isVerified) {
        if (decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.AppError(403, "Your are forbidden to update role.");
        }
    }
    if (!isUserExist.isVerified ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE ||
        isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isDeleted) {
        throw new AppError_1.AppError(400, "Somethig went wrong. Please contact our tema. User either 'inactive' or 'blocked' or 'deleted' or 'not varified'");
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return { data: newUpdatedUser };
});
const getAllRoleChangeRequest = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryModel = new queryBuilder_1.QueryBuilder(user_model_1.RoleChange.find(), query);
    const requsetedChanges = queryModel.sort().paginate();
    const [data, meta] = yield Promise.all([
        requsetedChanges.build(),
        queryModel.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const RoleChangeRequest = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isRoleRequestExist = yield user_model_1.RoleChange.find({
        userId: decodedToken.userId,
    });
    if (isRoleRequestExist.some((status) => status.status === user_interface_1.RoleStatus.PENDING)) {
        throw new AppError_1.AppError(400, "Your previous request pending.");
    }
    if (payload.reqRole === user_interface_1.Role.ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.AppError(400, "You are already an Admin");
    }
    if ((payload.reqRole === user_interface_1.Role.USER || payload.reqRole === user_interface_1.Role.DRIVER) &&
        (decodedToken.role === user_interface_1.Role.DRIVER || decodedToken.role === user_interface_1.Role.ADMIN)) {
        throw new AppError_1.AppError(400, "Driver or Admin can't ba Driver or User again.");
    }
    if (payload.reqRole === user_interface_1.Role.DRIVER && !payload.vehicle) {
        throw new AppError_1.AppError(400, "Driver must have a vehicle.");
    }
    const changeRequestPayload = {
        userId: decodedToken.userId,
        currentRole: decodedToken.role,
        requestedRole: payload.reqRole,
        status: user_interface_1.RoleStatus.PENDING,
        Vehicle: payload.reqRole === "DRIVER" ? payload.vehicle : null,
    };
    const changedRoleRequest = yield user_model_1.RoleChange.create(changeRequestPayload);
    return {
        data: changedRoleRequest,
    };
});
const updateRole = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_interface_1.RoleStatus.ACCEPTED, user_interface_1.RoleStatus.CANCELED].includes(payload)) {
        throw new AppError_1.AppError(400, `Request miss matched. Request should be either ${user_interface_1.RoleStatus.ACCEPTED} or ${user_interface_1.RoleStatus.CANCELED}`);
    }
    const session = yield user_model_1.RoleChange.startSession();
    session.startTransaction();
    try {
        const updatedRole = yield user_model_1.RoleChange.findByIdAndUpdate(_id, {
            status: payload,
        }, { new: true, runValidators: true, session });
        if (!updatedRole) {
            throw new AppError_1.AppError(400, "Faild to updated user Role.");
        }
        if (updatedRole.status === user_interface_1.RoleStatus.ACCEPTED) {
            const newUser = yield user_model_1.User.findByIdAndUpdate(updatedRole.userId, {
                role: updatedRole.requestedRole,
                Vehicle: updatedRole.requestedRole === user_interface_1.Role.DRIVER
                    ? updatedRole.Vehicle
                    : null,
            }, { new: true, runValidators: true, session }).select("-password");
            if (!newUser) {
                throw new AppError_1.AppError(400, "Failed to create token. User not found.");
            }
            yield session.commitTransaction();
            session.endSession();
            return {
                data: newUser,
            };
        }
        if (updatedRole.status === user_interface_1.RoleStatus.CANCELED) {
            yield session.commitTransaction();
            session.endSession();
            return { data: "Role update request rejected by admin" };
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        throw new AppError_1.AppError(400, "Faild to update role.");
    }
});
const requestRoleStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const pendingRequestPromise = user_model_1.RoleChange.find({
        status: user_interface_1.RoleStatus.PENDING,
    }).countDocuments();
    const acceptRequestPromise = user_model_1.RoleChange.find({
        status: user_interface_1.RoleStatus.ACCEPTED,
    }).countDocuments();
    const cancleRequestPromise = user_model_1.RoleChange.find({
        status: user_interface_1.RoleStatus.CANCELED,
    }).countDocuments();
    const [pendingRequest, acceptRequest, cancleRequest] = yield Promise.all([
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
});
exports.UserServices = {
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
