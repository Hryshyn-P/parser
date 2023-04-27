import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from '../models/donation.model';
import { Employee } from '../models/employee.model';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation)
    private readonly donationModel: typeof Donation,
  ) {}

  async findAll(): Promise<Donation[]> {
    return this.donationModel.findAll({
      include: [Employee],
    });
  }

  async findById(id: number): Promise<Donation> {
    return this.donationModel.findByPk(id, {
      include: [Employee],
    });
  }

  async create(donation: Donation): Promise<Donation> {
    return this.donationModel.create(donation);
  }

  async update(id: number, donation: Donation): Promise<[number, Donation[]]> {
    return this.donationModel.update(donation, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<void> {
    await this.donationModel.destroy({
      where: { id },
    });
  }
}
