import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseModelRelations1655135692656 implements MigrationInterface {
    name = 'BaseModelRelations1655135692656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` json NOT NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`facultyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD \`universityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`description\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`university\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`university\` ADD \`description\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD \`description\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_5b67a8cf2236b014dcf547f5d66\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_8bd771a1318f38978d9d4f8d8a2\` FOREIGN KEY (\`facultyId\`) REFERENCES \`faculty\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD CONSTRAINT \`FK_88e74db0a37a1534a352d4a330c\` FOREIGN KEY (\`universityId\`) REFERENCES \`university\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP FOREIGN KEY \`FK_88e74db0a37a1534a352d4a330c\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_8bd771a1318f38978d9d4f8d8a2\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_5b67a8cf2236b014dcf547f5d66\``);
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`university\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`university\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP COLUMN \`universityId\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`facultyId\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
