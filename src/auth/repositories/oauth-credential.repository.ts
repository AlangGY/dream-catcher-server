import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OAuthCredential } from '../entities/oauth-credential.entity';
import { OAuthProvider } from '../entities/oauth-provider.entity';
import { User } from '../entities/user.entity';

export interface IOAuthCredentialRepository {
  findByProviderIdAndProviderId(
    providerId: string,
    provider: OAuthProvider,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential | null>;
  create(
    providerId: string,
    user: User,
    provider: OAuthProvider,
    accessToken: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential>;
  update(
    credential: OAuthCredential,
    accessToken: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential>;
}

@Injectable()
export class OAuthCredentialRepository implements IOAuthCredentialRepository {
  constructor(private dataSource: DataSource) {}

  private getManager(entityManager?: EntityManager): EntityManager {
    return entityManager || this.dataSource.manager;
  }

  async findByProviderIdAndProviderId(
    providerId: string,
    provider: OAuthProvider,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential | null> {
    const manager = this.getManager(entityManager);
    return manager.findOne(OAuthCredential, {
      where: {
        providerId,
        provider: { id: provider.id },
      },
      relations: ['user', 'provider'],
    });
  }

  async create(
    providerId: string,
    user: User,
    provider: OAuthProvider,
    accessToken: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential> {
    const manager = this.getManager(entityManager);
    const credential = manager.create(OAuthCredential, {
      providerId,
      user,
      provider,
      accessToken,
      refreshToken,
    });
    return manager.save(OAuthCredential, credential);
  }

  async update(
    credential: OAuthCredential,
    accessToken: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<OAuthCredential> {
    const manager = this.getManager(entityManager);
    credential.accessToken = accessToken;
    credential.refreshToken = refreshToken;
    return manager.save(OAuthCredential, credential);
  }
}
