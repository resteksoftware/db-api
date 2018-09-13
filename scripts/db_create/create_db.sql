DROP TABLE IF EXISTS

incidents,
incident_statuses,
incident_remarks,
incident_assignments,
users,
carriers,
track_user_apparatus,
track_user_stations,
track_user_departments,
departments,
stations,
apparatus,
responses_apparatus,
responses_users

CASCADE;

CREATE TABLE "incidents" (
	"inc_status_id" integer NOT NULL,
	"inc_id" serial NOT NULL,
	"dept_id" integer NOT NULL,
	"fd_dispatch_id" varchar NOT NULL,
	"slug" varchar NOT NULL UNIQUE,
	"created_at" TIMESTAMP DEFAULT NOW(),
	"timeout" TIMESTAMP NOT NULL,
	"radio_freq" varchar NOT NULL,
	"inc_category" varchar NOT NULL,
	"inc_description" varchar NOT NULL,
	"inc_type_code" varchar NOT NULL,
	"apt_no" varchar,
	"location" varchar NOT NULL,
	"location_name" varchar NOT NULL,
	"location_type" varchar NOT NULL,
	"city" varchar NOT NULL,
	"zip" varchar NOT NULL,
	"cross_street" varchar NOT NULL,
	"map_ref" varchar NOT NULL,
	"latitude" varchar NOT NULL,
	"longitude" varchar NOT NULL,
	"hot_zone" varchar NOT NULL,
	"warm_zone" varchar NOT NULL,
	"test_call" BOOLEAN NOT NULL,
	CONSTRAINT incidents_pk PRIMARY KEY ("inc_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "incident_statuses" (
	"inc_status_id" serial NOT NULL,
	"created_at" TIMESTAMP DEFAULT NOW(),
	"pending" TIMESTAMP,
	"active" TIMESTAMP,
	"closed" TIMESTAMP,
	"cancelled" TIMESTAMP,
	"filed" TIMESTAMP,
	CONSTRAINT incident_statuses_pk PRIMARY KEY ("inc_status_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "incident_remarks" (
	"inc_remark_id" serial NOT NULL,
	"created_at" TIMESTAMP DEFAULT NOW(),
	"remark" varchar,
	"inc_id" integer NOT NULL,
	CONSTRAINT incident_remarks_pk PRIMARY KEY ("inc_remark_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "incident_assignments" (
	"inc_assignment_id" serial NOT NULL,
	"created_at" TIMESTAMP DEFAULT NOW(),
	"assignment" varchar,
	"inc_id" integer NOT NULL,
	CONSTRAINT incident_assignments_pk PRIMARY KEY ("inc_assignment_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"user_id" serial NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"mobile_num" varchar NOT NULL,
	"carrier_id" integer NOT NULL,
	"email" varchar NOT NULL,
	"device_os" varchar NOT NULL,
	"rank" varchar NOT NULL,
	"default_station" integer NOT NULL,
	"is_driver" BOOLEAN NOT NULL,
	"is_enabled" BOOLEAN NOT NULL,
	"is_sleeping" BOOLEAN NOT NULL,
	"is_admin" BOOLEAN NOT NULL,
	"is_deleted" BOOLEAN NOT NULL,
	"is_career" BOOLEAN NOT NULL,
	"is_volley" BOOLEAN NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "carriers" (
	"carrier_id" serial NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP,
	"carrier_name" varchar NOT NULL,
	"gateway" varchar NOT NULL,
	"is_enabled" BOOLEAN NOT NULL,
	CONSTRAINT carriers_pk PRIMARY KEY ("carrier_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "track_user_apparatus" (
	"user_app_id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"app_id" integer NOT NULL,
	CONSTRAINT track_user_apparatus_pk PRIMARY KEY ("user_app_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "track_user_stations" (
	"user_sta_id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"sta_id" integer NOT NULL,
	CONSTRAINT track_user_stations_pk PRIMARY KEY ("user_sta_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "track_user_departments" (
	"user_dept_id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"dept_id" integer NOT NULL,
	CONSTRAINT track_user_departments_pk PRIMARY KEY ("user_dept_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "departments" (
	"dept_id" serial NOT NULL,
	"dept_name" varchar NOT NULL,
	"dept_abbr" varchar NOT NULL,
	"dept_head" varchar NOT NULL,
	"dept_ip" varchar NOT NULL,
	"dept_city" varchar NOT NULL,
	"dept_state" varchar NOT NULL,
	"dept_zip" varchar NOT NULL,
	"dept_county" varchar NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT departments_pk PRIMARY KEY ("dept_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "stations" (
	"dept_id" serial NOT NULL,
	"sta_id" serial NOT NULL,
	"sta_name" varchar NOT NULL,
	"sta_abbr" varchar NOT NULL,
	"is_enabled" BOOLEAN NOT NULL,
	"sta_type" varchar NOT NULL,
	"sta_gps" varchar NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT stations_pk PRIMARY KEY ("sta_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "apparatus" (
	"app_id" serial NOT NULL,
	"sta_id" integer NOT NULL,
	"app_abbr" varchar NOT NULL,
	"app_name" varchar NOT NULL,
	"is_enabled" BOOLEAN NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT apparatus_pk PRIMARY KEY ("app_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "responses_apparatus" (
	"resp_app_id" serial NOT NULL,
	"app_id" integer NOT NULL,
	"inc_id" integer NOT NULL,
	"init_resp_timestamp" TIMESTAMP NOT NULL,
	"init_resp_gps" varchar NOT NULL,
	"onscene_resp_timestamp" TIMESTAMP,
	"onscene_resp_gps" varchar,
	"closing_resp_timestamp" TIMESTAMP,
	"closing_resp_gps" varchar,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT responses_apparatus_pk PRIMARY KEY ("resp_app_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "responses_users" (
	"resp_user_id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"inc_id" integer NOT NULL,
	"respond_direct" BOOLEAN NOT NULL,
	"init_resp_timestamp" TIMESTAMP NOT NULL,
	"init_resp_gps" varchar NOT NULL,
	"onscene_resp_timestamp" TIMESTAMP,
	"onscene_resp_gps" varchar,
	"closing_resp_timestamp" TIMESTAMP,
	"closing_resp_gps" varchar,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT responses_users_pk PRIMARY KEY ("resp_user_id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "incidents" ADD CONSTRAINT "incidents_fk0" FOREIGN KEY ("inc_status_id") REFERENCES "incident_statuses"("inc_status_id");
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_fk1" FOREIGN KEY ("dept_id") REFERENCES "departments"("dept_id");


ALTER TABLE "incident_remarks" ADD CONSTRAINT "incident_remarks_fk0" FOREIGN KEY ("inc_id") REFERENCES "incidents"("inc_id");

ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_fk0" FOREIGN KEY ("inc_id") REFERENCES "incidents"("inc_id");

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("carrier_id");


ALTER TABLE "track_user_apparatus" ADD CONSTRAINT "track_user_apparatus_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "track_user_apparatus" ADD CONSTRAINT "track_user_apparatus_fk1" FOREIGN KEY ("app_id") REFERENCES "apparatus"("app_id");

ALTER TABLE "track_user_stations" ADD CONSTRAINT "track_user_stations_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "track_user_stations" ADD CONSTRAINT "track_user_stations_fk1" FOREIGN KEY ("sta_id") REFERENCES "stations"("sta_id");

ALTER TABLE "track_user_departments" ADD CONSTRAINT "track_user_departments_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "track_user_departments" ADD CONSTRAINT "track_user_departments_fk1" FOREIGN KEY ("dept_id") REFERENCES "departments"("dept_id");


ALTER TABLE "stations" ADD CONSTRAINT "stations_fk0" FOREIGN KEY ("dept_id") REFERENCES "departments"("dept_id");

ALTER TABLE "apparatus" ADD CONSTRAINT "apparatus_fk0" FOREIGN KEY ("sta_id") REFERENCES "stations"("sta_id");

ALTER TABLE "responses_apparatus" ADD CONSTRAINT "responses_apparatus_fk0" FOREIGN KEY ("app_id") REFERENCES "apparatus"("app_id");
ALTER TABLE "responses_apparatus" ADD CONSTRAINT "responses_apparatus_fk1" FOREIGN KEY ("inc_id") REFERENCES "incidents"("inc_id");

ALTER TABLE "responses_users" ADD CONSTRAINT "responses_users_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
ALTER TABLE "responses_users" ADD CONSTRAINT "responses_users_fk1" FOREIGN KEY ("inc_id") REFERENCES "incidents"("inc_id");
