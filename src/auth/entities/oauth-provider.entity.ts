import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthCredential } from './oauth-credential.entity';

export enum OAuthProviderType {
  KAKAO = 'KAKAO',
}

@Entity()
export class OAuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OAuthProviderType,
    unique: true,
  })
  name: OAuthProviderType;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  clientSecret?: string;

  @Column()
  redirectUri: string;

  @OneToMany(() => OAuthCredential, (credential) => credential.provider)
  credentials: OAuthCredential[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
