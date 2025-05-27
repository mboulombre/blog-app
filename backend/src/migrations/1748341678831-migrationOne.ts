import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationOne1748341678831 implements MigrationInterface {
    name = 'MigrationOne1748341678831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
