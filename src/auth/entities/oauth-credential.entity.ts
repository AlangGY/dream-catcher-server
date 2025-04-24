import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthProvider } from './oauth-provider.entity';
import { User } from './user.entity';

@Entity()
export class OAuthCredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  providerId: string;

  @ManyToOne(() => User, (user) => user.oauthCredentials)
  user: User;

  @ManyToOne(() => OAuthProvider, (provider) => provider.credentials)
  provider: OAuthProvider;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
