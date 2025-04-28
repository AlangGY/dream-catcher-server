import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export interface ITransactionService {
  runInTransaction<T>(
    operation: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T>;
}

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(
    operation: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
