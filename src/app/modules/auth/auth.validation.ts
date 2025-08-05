import z from "zod";

export const credentialLoginZodSchema = z.object({
  email: z.email({ message: "Invalied email address." }),
  password: z
    .string()
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
});

export const setPasswordZodSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
});

export const changePasswordZodSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
  newPassword: z
    .string()
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
});
