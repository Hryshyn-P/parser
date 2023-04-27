import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Statement } from '../models/statement.model';

@Injectable()
export class StatementService {
  constructor(
    @InjectModel(Statement)
    private statementModel: typeof Statement,
  ) {}

  async createStatement(statement: Statement): Promise<Statement> {
    return await this.statementModel.create(statement);
  }

  async findAll(): Promise<Statement[]> {
    const statements = await this.statementModel.findAll();
    return statements;
  }

  async findOne(id: number): Promise<Statement> {
    const statement = await this.statementModel.findByPk(id);
    return statement;
  }

  async update(
    id: number,
    statementData: Partial<Statement>,
  ): Promise<Statement> {
    const statement = await this.statementModel.findByPk(id);
    await statement.update(statementData);
    return statement.reload();
  }

  async delete(id: number): Promise<void> {
    await this.statementModel.destroy({ where: { id } });
  }
}
