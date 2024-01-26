import {User} from "../models/domain/user.entity";
import {CreateUserDto} from "../models/dto/create-user.dto";

export class UserTransformer {
    public static interfaceToEntity(selectedUser: CreateUserDto, hashedPassword?: string, userId?: string): User {
        const user = new User();
        Object.assign(user, selectedUser);
        user.first_name = selectedUser.firstName;
        user.last_name = selectedUser.lastName;
        if (userId) {
            user.user_id = userId;
        }
        if (hashedPassword) {
            user.password = hashedPassword;
        }
        return user;
    }

    public static createdUserToInterface(user: User, accessToken?: string): User | any {
        return {
            userId: user.user_id ? user.user_id : null,
            accessToken: accessToken ? accessToken : null,
            firstName: user.first_name ? user.first_name : null,
            lastName: user.last_name ? user.last_name : null,
            email: user.email ? user.email : null,
            phone: user.phone ? user.phone : null,
            address: user.address ? user.address : null,
        }
    }

}
