import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BlackList {
  @PrimaryColumn({
    name: 'key',
    type: 'varchar',
  })
  key: string;
  @Column({
    name: 'token_id',
    type: 'uuid',
  })
  tokenId: string;
}
