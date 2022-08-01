import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrationV11659277420200 implements MigrationInterface {
  name = 'migrationV11659277420200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "client_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "client_id" jsonb NOT NULL DEFAULT '[]'`,
    );
  }
}
