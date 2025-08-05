import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.service";
import { SendResponse } from "../../utils/SendResponse";
import { JwtPayload } from "jsonwebtoken";

const getRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await DriverServices.getRideRequest(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride Request retirve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getEarningHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const decodedToken = req.user as JwtPayload;
    const result = await DriverServices.getEarningHistory(
      query as Record<string, string>,
      decodedToken
    );

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride Request retirve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const beADriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const payload = req.body.status;
    const decodedToken = req.user as JwtPayload;
    const result = await DriverServices.beADriver(_id, payload, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride status updated",
      data: result.data,
    });
  }
);

const pendingRideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const result = await DriverServices.pendingRideStatus(_id, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride status updated",
      data: result.data,
    });
  }
);

export const DriverControllers = {
  getRideRequest,
  getEarningHistory,
  beADriver,
  pendingRideStatus,
};
