import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskDueDate1655137089672 implements MigrationInterface {
    name = 'AddTaskDueDate1655137089672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`dueDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`dueDate\``);
    }

}
