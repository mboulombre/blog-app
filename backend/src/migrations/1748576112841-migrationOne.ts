import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationOne1748576112841 implements MigrationInterface {
    name = 'MigrationOne1748576112841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tags" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tags"`);
    }

}
