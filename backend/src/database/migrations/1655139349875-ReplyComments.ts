import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplyComments1655139349875 implements MigrationInterface {
    name = 'ReplyComments1655139349875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rcomment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`content\` json NOT NULL, \`userId\` int NOT NULL, \`taskId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rcomment\` ADD CONSTRAINT \`FK_a70a69f305a69d72270967ef1a5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rcomment\` ADD CONSTRAINT \`FK_dab6bae3675323383dac5536520\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rcomment\` DROP FOREIGN KEY \`FK_dab6bae3675323383dac5536520\``);
        await queryRunner.query(`ALTER TABLE \`rcomment\` DROP FOREIGN KEY \`FK_a70a69f305a69d72270967ef1a5\``);
        await queryRunner.query(`DROP TABLE \`rcomment\``);
    }

}
