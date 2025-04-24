import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  OAuthProvider,
  OAuthProviderType,
} from '../entities/oauth-provider.entity';

export interface IOAuthProviderRepository {
  findByName(
    name: OAuthProviderType,
    entityManager?: EntityManager,
  ): Promise<OAuthProvider | null>;
  save(
    provider: OAuthProvider,
    entityManager?: EntityManager,
  ): Promise<OAuthProvider>;
}

@Injectable()
export class OAuthProviderRepository implements IOAuthProviderRepository {
  constructor(private dataSource: DataSource) {}

  private getManager(entityManager?: EntityManager): EntityManager {
    return entityManager || this.dataSource.manager;
  }

  async findByName(
    name: OAuthProviderType,
    entityManager?: EntityManager,
  ): Promise<OAuthProvider | null> {
    const manager = this.getManager(entityManager);
    return manager.findOne(OAuthProvider, { where: { name } });
  }

  async save(
    provider: OAuthProvider,
    entityManager?: EntityManager,
  ): Promise<OAuthProvider> {
    const manager = this.getManager(entityManager);
    return manager.save(OAuthProvider, provider);
  }
}
