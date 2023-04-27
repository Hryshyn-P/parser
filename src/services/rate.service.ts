import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rate } from '../models/rate.model';

@Injectable()
export class RateService {
  constructor(
    @InjectModel(Rate)
    private readonly rateModel: typeof Rate,
  ) {}

  async create(rateData: Partial<Rate>): Promise<Rate> {
    const rate = new Rate(rateData);
    return rate.save();
  }

  async findAll(): Promise<Rate[]> {
    return this.rateModel.findAll();
  }

  async findById(id: number): Promise<Rate> {
    return this.rateModel.findByPk(id);
  }

  async update(id: number, rateData: Partial<Rate>): Promise<[number, Rate[]]> {
    return this.rateModel.update(rateData, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return this.rateModel.destroy({ where: { id } });
  }
}
