import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { SendResponse } from "../../utils/SendResponse";

const rideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;

    const result = await RideServices.rideRequest(
      payload,
      decodedToken as JwtPayload
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Request made successfully",
      data: result.data,
    });
  }
);

const rideCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await RideServices.rideCancel(decodedToken);
    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Request cancel successfully",
      data: result.data,
    });
  }
);

const rideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const decodedToken = req.user as JwtPayload;

    const result = await RideServices.rideHistory(
      decodedToken,
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Ride history retrived successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const rideCancelDeletion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideServices.rideCancelDeletion();

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Request cancel successfully",
      data: result.data,
    });
  }
);

const allRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await RideServices.allRideHistory(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Ride history retrived successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const RideControllers = {
  rideRequest,
  rideCancel,
  rideHistory,
  rideCancelDeletion,
  allRideHistory,
};
