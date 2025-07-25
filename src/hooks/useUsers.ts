import { UserService } from "@/services/user.services";
import { User, UserRole } from "@/types/user";

export const useUsers = () => {
  const userService = new UserService();

  const createUser = async (data: User) => {
    const newUser: User = {
      userName: data.userName,
      role: UserRole.Company,
      //token: undefined,
    };
    await userService.create(newUser);
  };

  return {
    createUser,
  };
};
