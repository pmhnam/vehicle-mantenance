import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1768323988427 implements MigrationInterface {
  name = 'Migrations1768323988427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "maintenance_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "vehicle_id" uuid NOT NULL, "config_id" uuid, "item_name" character varying(100) NOT NULL, "performed_at_km" integer NOT NULL, "performed_at_date" date NOT NULL, "cost" numeric(10,2), "note" text, CONSTRAINT "PK_096e4b6bb7c9fe74d960e7523e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "maintenance_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profileId" uuid NOT NULL, "item_name" character varying(100) NOT NULL, "maintenance_type" character varying(20) NOT NULL DEFAULT 'replace', "interval_km" integer, "intervalMonths" integer, CONSTRAINT "PK_d4b4f6ff54f428ef187e3247139" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "maintenance_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "description" text, CONSTRAINT "UQ_7d880bfe0e8e36862b13f3408be" UNIQUE ("code"), CONSTRAINT "PK_80de6da94fe6be82f61d71edd54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "license_plate" character varying(20) NOT NULL, "current_odo" integer NOT NULL DEFAULT '0', "initial_odo" integer NOT NULL DEFAULT '0', "purchase_date" date NOT NULL, "profileId" uuid, CONSTRAINT "UQ_7e9fab2e8625b63613f67bd706c" UNIQUE ("license_plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "telegram_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "telegram_id" bigint NOT NULL, "chat_id" bigint NOT NULL, "username" character varying(100), "first_name" character varying(100), "vehicle_id" uuid, CONSTRAINT "UQ_88256a651008c00c1eea23e0b61" UNIQUE ("telegram_id"), CONSTRAINT "PK_dcba80e97f84ad7f9bc8f19f472" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_logs" ADD CONSTRAINT "FK_d105b4df637a089914716885c71" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_logs" ADD CONSTRAINT "FK_01af633432c3ed253fa408f5b55" FOREIGN KEY ("config_id") REFERENCES "maintenance_configs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_configs" ADD CONSTRAINT "FK_f0af0e1ca2e850308915423f8c4" FOREIGN KEY ("profileId") REFERENCES "maintenance_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "FK_6f3445c2cf4950991835f6c378d" FOREIGN KEY ("profileId") REFERENCES "maintenance_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_users" ADD CONSTRAINT "FK_2c3c8a819053b8baf843c1be364" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "telegram_users" DROP CONSTRAINT "FK_2c3c8a819053b8baf843c1be364"`);
    await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_6f3445c2cf4950991835f6c378d"`);
    await queryRunner.query(`ALTER TABLE "maintenance_configs" DROP CONSTRAINT "FK_f0af0e1ca2e850308915423f8c4"`);
    await queryRunner.query(`ALTER TABLE "maintenance_logs" DROP CONSTRAINT "FK_01af633432c3ed253fa408f5b55"`);
    await queryRunner.query(`ALTER TABLE "maintenance_logs" DROP CONSTRAINT "FK_d105b4df637a089914716885c71"`);
    await queryRunner.query(`DROP TABLE "telegram_users"`);
    await queryRunner.query(`DROP TABLE "vehicles"`);
    await queryRunner.query(`DROP TABLE "maintenance_profiles"`);
    await queryRunner.query(`DROP TABLE "maintenance_configs"`);
    await queryRunner.query(`DROP TABLE "maintenance_logs"`);
  }
}
