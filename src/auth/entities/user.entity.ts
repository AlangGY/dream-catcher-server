import { Dream } from 'src/dreams/entities/dream.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OAuthCredential } from './oauth-credential.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  profileImage?: string;

  @OneToMany(() => Dream, (dream) => dream.user)
  dreams: Dream[];

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => OAuthCredential, (credential) => credential.user)
  oauthCredentials: OAuthCredential[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
