import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1655393659921 implements MigrationInterface {
    name = 'Roles1655393659921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`category\` enum ('university', 'faculty', 'course', 'task') NOT NULL, \`title\` enum ('moderator', 'reader') NOT NULL, \`universityId\` int NULL, \`facultyId\` int NULL, \`courseId\` int NULL, \`taskId\` int NULL, INDEX \`IDX_7b80370fb76a26d2e5f7058961\` (\`category\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_3e02d32dd4707c91433de0390ea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_ddb935a70b28d4cd757a692918f\` FOREIGN KEY (\`universityId\`) REFERENCES \`university\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_ab3006790d29b87df9851d5aeb6\` FOREIGN KEY (\`facultyId\`) REFERENCES \`faculty\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_84cbca47a9f3aa38378510ef961\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_d4a5695c327db6743cfacbb5e91\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_d4a5695c327db6743cfacbb5e91\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_84cbca47a9f3aa38378510ef961\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_ab3006790d29b87df9851d5aeb6\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_ddb935a70b28d4cd757a692918f\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_3e02d32dd4707c91433de0390ea\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b80370fb76a26d2e5f7058961\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
