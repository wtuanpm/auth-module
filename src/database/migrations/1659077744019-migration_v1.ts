import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationV11659077744019 implements MigrationInterface {
    name = 'migrationV11659077744019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black_list" ("token_id" uuid NOT NULL, CONSTRAINT "PK_b2eb1b18d76da0cb9d9311f5bfb" PRIMARY KEY ("token_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL, "token_id" uuid NOT NULL, "device_token" character varying NOT NULL, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "black_list"`);
    }

}
