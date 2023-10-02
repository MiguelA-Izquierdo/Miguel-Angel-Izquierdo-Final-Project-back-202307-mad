import { User } from '../entities/user.js';
import { Repository } from './repository.structure.js';
import { UserModel } from './user.mongo.model.js';

export class UsersMongoRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    return UserModel.find().exec();
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).exec();
    if (!data) {
      throw new Error();
    }

    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    return UserModel.create(newData);
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, { new: true });
    if (!data) throw new Error();
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result) throw new Error();
  }

  async find({ key, value }: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [key]: value }).exec();
    return data;
  }
}
