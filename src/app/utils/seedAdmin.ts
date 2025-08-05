import { envVars } from "../configs/env.config";
import { IAuthProviders, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Admin already exist.");
      return;
    }

    const authProvider: IAuthProviders = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
    };

    const adminPayload: IUser = {
      name: "Admin",
      email: envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
      password: envVars.SUPER_ADMIN.SUPER_ADMIN_PASSWORD,
      auth: [authProvider],
      role: Role.ADMIN,
      phone: envVars.SUPER_ADMIN.SUPER_ADMIN_PHONE,
      address: envVars.SUPER_ADMIN.SUPER_ADMIN_ADDRESS,
      isVerified: true,
    };

    const superAdmin = await User.create(adminPayload);

    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
