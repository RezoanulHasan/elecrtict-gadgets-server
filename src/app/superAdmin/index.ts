/* eslint-disable prefer-const */
import config from '../config';
import { UserModel as IUserModel } from '../modules/user/user.model';
import bcrypt from 'bcrypt';

const superUser = {
  username: config.super_admin_username,
  email: 'rezoanulhasan96@gmail.com',
  password: config.super_admin_password,
  passwordChangeHistory: [], // Changed to an empty array for consistency
  role: 'superAdmin',
  phoneNumber: '01734639066',
  userImage: 'https://i.ibb.co/MDL2Nx5/Admin-n.jpg',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await IUserModel.findOne({ role: 'superAdmin' });

    if (!isSuperAdminExists) {
      let { password, ...restSuperUser } = superUser;

      if (!password) {
        // Provide a default password if it's not defined
        password = 'defaultPassword';
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const superAdminWithHashedPassword = {
        ...restSuperUser,
        password: hashedPassword,
      };

      await IUserModel.create(superAdminWithHashedPassword);
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};

export default seedSuperAdmin;
