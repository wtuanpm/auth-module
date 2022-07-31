import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserTokens {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'token_id',
    type: 'uuid',
  })
  tokenId: string;

  @Column({
    name: 'device_token',
    type: 'varchar',
  })
  deviceToken: string;
}
