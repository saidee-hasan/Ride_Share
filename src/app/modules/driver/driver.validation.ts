import z from "zod";
import { RideStatus } from "../ride/ride.interface";

export const beADriverZodSchema = z.object({
  status: z.enum(Object.values(RideStatus)),
});
