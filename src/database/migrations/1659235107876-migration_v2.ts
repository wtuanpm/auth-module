import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationV21659235107876 implements MigrationInterface {
    name = 'migrationV21659235107876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_tokens" ("user_id" uuid NOT NULL, "token_id" uuid NOT NULL, "device_token" character varying NOT NULL, CONSTRAINT "PK_9e144a67be49e5bba91195ef5de" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "key" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "PK_b2eb1b18d76da0cb9d9311f5bfb"`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "PK_e2d3ffc39343131731ca0130fca" PRIMARY KEY ("token_id", "key")`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "PK_e2d3ffc39343131731ca0130fca"`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "PK_1c75a1b8fd119ce64e716db1690" PRIMARY KEY ("key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "PK_1c75a1b8fd119ce64e716db1690"`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "PK_e2d3ffc39343131731ca0130fca" PRIMARY KEY ("token_id", "key")`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "PK_e2d3ffc39343131731ca0130fca"`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "PK_b2eb1b18d76da0cb9d9311f5bfb" PRIMARY KEY ("token_id")`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "key"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
    }

}
