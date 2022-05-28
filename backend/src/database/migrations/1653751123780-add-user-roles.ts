import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserRoles1653751123780 implements MigrationInterface {
    name = 'addUserRoles1653751123780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` enum ('student', 'staff', 'teacher', 'admin') NOT NULL DEFAULT 'student'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    }

}
