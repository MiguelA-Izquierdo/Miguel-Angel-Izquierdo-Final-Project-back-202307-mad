import { debug } from 'console';
import { Travel } from '../entities/travel.js';
import { Repository } from './repository.structure.js';
import { TravelModel } from './travel.mongo.model.js';

export class TravelMongoRepository implements Repository<Travel> {
  async getAll(): Promise<Travel[]> {
    return TravelModel.find().populate('traveler', { userName: 1 }).exec();
  }

  async getById(id: string): Promise<Travel> {
    const data = await TravelModel.findById(id)
      .populate('traveler', { id: 1, userName: 1 })
      .exec();
    if (!data) {
      throw new Error();
    }

    return data;
  }

  async create(newData: Omit<Travel, 'id'>): Promise<Travel> {
    const data = (await TravelModel.create(newData)).populate('traveler', {});
    return data;
  }

  async update(id: string, newData: Partial<Travel>): Promise<Travel> {
    const data = await TravelModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
    if (!data) throw new Error();
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await TravelModel.findByIdAndDelete(id).exec();
    if (!result) throw new Error();
  }

  async find({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Travel[]> {
    debug('key', key, 'value', value);
    const data = await TravelModel.find({ [key]: value })
      .populate('traveler')
      .exec();
    return data;
  }
}
