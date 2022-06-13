import { MigrationInterface, QueryRunner } from "typeorm";

export class SoftDelete1655162573680 implements MigrationInterface {
    name = 'SoftDelete1655162573680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`rcomment\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`university\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`university\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`rcomment\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedAt\``);
    }

}
