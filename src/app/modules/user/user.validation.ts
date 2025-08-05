import z from "zod";
import {
  IsActive,
  IsOnline,
  IVehicle,
  Role,
  RoleStatus,
} from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "User name should be atleast 1 character." }),
  email: z.email({ message: "Invalied email address." }),
  password: z
    .string()
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
  phone: z.string().regex(/^(?:\+8801\d{9})|01\d{9}$/, {
    message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
  }),
  address: z.string().optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "User name should be atleast 1 character." })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d[9])|01\d[9]$/, {
      message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  address: z.string().optional(),
  isOnline: z.enum(Object.values(IsOnline)).optional(),
});

export const RoleChangeRequestZodSchema = z.object({
  reqRole: z.enum([Role.ADMIN, Role.DRIVER], {
    message: "Can't request for being a user.",
  }),
  vehicle: z
    .enum(Object.values(IVehicle), {
      message: "Only Car and Bike are allowed.",
    })
    .optional(),
});

export const updateRoleZodeSchema = z.object({
  isAccepted: z.enum([RoleStatus.ACCEPTED, RoleStatus.CANCELED]),
});
