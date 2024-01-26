import {EntityRepository, Repository} from 'typeorm';
import {User} from "../models/domain/user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    protected TAG: string = `UserRepository`;

    public async saveUser(user: User): Promise<User> {
        return await this.save(user);
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await this.createQueryBuilder('user')
            .where('user.email = :email', {email})
            .getOne()
    }

}
