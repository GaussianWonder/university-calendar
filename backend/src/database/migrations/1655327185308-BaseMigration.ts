import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1655327185308 implements MigrationInterface {
    name = 'BaseMigration1655327185308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('student', 'staff', 'teacher', 'admin') NOT NULL DEFAULT 'student', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rcomment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`content\` json NOT NULL, \`userId\` int NOT NULL, \`taskId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` json NOT NULL, \`dueDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`courseId\` int NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` json NOT NULL, \`facultyId\` int NULL, UNIQUE INDEX \`IDX_30d559218724a6d6e0cc4f26b0\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`faculty\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` json NOT NULL, \`universityId\` int NOT NULL, UNIQUE INDEX \`IDX_51150eab3799d36d1ee6f9a643\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`university\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` json NOT NULL, UNIQUE INDEX \`IDX_07cafed89eab6f445f9e5c663f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rcomment\` ADD CONSTRAINT \`FK_a70a69f305a69d72270967ef1a5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rcomment\` ADD CONSTRAINT \`FK_dab6bae3675323383dac5536520\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_5b67a8cf2236b014dcf547f5d66\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_8bd771a1318f38978d9d4f8d8a2\` FOREIGN KEY (\`facultyId\`) REFERENCES \`faculty\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`faculty\` ADD CONSTRAINT \`FK_88e74db0a37a1534a352d4a330c\` FOREIGN KEY (\`universityId\`) REFERENCES \`university\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`faculty\` DROP FOREIGN KEY \`FK_88e74db0a37a1534a352d4a330c\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_8bd771a1318f38978d9d4f8d8a2\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_5b67a8cf2236b014dcf547f5d66\``);
        await queryRunner.query(`ALTER TABLE \`rcomment\` DROP FOREIGN KEY \`FK_dab6bae3675323383dac5536520\``);
        await queryRunner.query(`ALTER TABLE \`rcomment\` DROP FOREIGN KEY \`FK_a70a69f305a69d72270967ef1a5\``);
        await queryRunner.query(`DROP INDEX \`IDX_07cafed89eab6f445f9e5c663f\` ON \`university\``);
        await queryRunner.query(`DROP TABLE \`university\``);
        await queryRunner.query(`DROP INDEX \`IDX_51150eab3799d36d1ee6f9a643\` ON \`faculty\``);
        await queryRunner.query(`DROP TABLE \`faculty\``);
        await queryRunner.query(`DROP INDEX \`IDX_30d559218724a6d6e0cc4f26b0\` ON \`course\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`rcomment\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
