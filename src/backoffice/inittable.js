const inittable = {
    db:null,
    init: (db) => {
        inittable.db = db;
    },
    execute: ()=> {
        inittable.createStatus()
        inittable.createEvent()
        inittable.createCategory()
        inittable.createDevice()
        inittable.createTicket()
        inittable.createField()
        inittable.createFieldValue()
        inittable.createUser()
    },
    createStatus: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "status" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "name"	VARCHAR NOT NULL
            );

            CREATE INDEX IF NOT EXISTS "status_name" ON "status" (
                "name"
            );
        `);
    },

    createEvent: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "event" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "external_id"	INTEGER DEFAULT NULL,
                "hashlink"	VARCHAR DEFAULT NULL,
                "server_user"	VARCHAR DEFAULT NULL,
                "server_pass"	VARCHAR DEFAULT NULL,
                "name"	VARCHAR NOT NULL,
                "local"	VARCHAR NOT NULL,
                "active"	TINYINT NOT NULL DEFAULT 1,
                "start_date"	DATETIME NOT NULL,
                "end_date"	DATETIME NOT NULL,
                "created_at"	DATETIME NOT NULL,
                "updated_at"	DATETIME NOT NULL,
                "deleted_at"	DATETIME
            );
            
            CREATE INDEX IF NOT EXISTS "event_deleted_at" ON "event" (
                "deleted_at"
            );
            CREATE INDEX IF NOT EXISTS "event_updated_at" ON "event" (
                "updated_at"
            );
            CREATE INDEX IF NOT EXISTS "event_created_at" ON "event" (
                "created_at"
            );
            CREATE INDEX IF NOT EXISTS "event_end_date" ON "event" (
                "end_date"
            );
            CREATE INDEX IF NOT EXISTS "event_start_date" ON "event" (
                "start_date"
            );
            CREATE INDEX IF NOT EXISTS "event_name" ON "event" (
                "name"
            );
            CREATE INDEX IF NOT EXISTS "event_hashlink" ON "event" (
                "hashlink"
            );
        `);
    },
    
    createCategory: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "category" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "event_id"	INTEGER NOT NULL,
                "name"	VARCHAR NOT NULL,
                "start_date"	DATETIME DEFAULT NULL,
                "end_date"	DATETIME DEFAULT NULL,
                "active"	TINYINT NOT NULL DEFAULT 1,
                CONSTRAINT "category_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );
            CREATE INDEX IF NOT EXISTS "category_name" ON "category" (
                "name"
            );
            CREATE INDEX IF NOT EXISTS "category_event_id" ON "category" (
                "event_id"
            );
        `);
    },
    
    createDevice: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "device" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "event_id"	INTEGER NOT NULL,
                "type"	TEXT NOT NULL,
                "name"	VARCHAR NOT NULL,
                "ip"	VARCHAR DEFAULT NULL,
                "key"	VARCHAR DEFAULT NULL,
                "active"	TINYINT NOT NULL DEFAULT 1,
                CONSTRAINT "device_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );

            CREATE INDEX IF NOT EXISTS "device_key" ON "device" (
                "key"
            );
            CREATE INDEX IF NOT EXISTS "device_ip" ON "device" (
                "ip"
            );
            CREATE INDEX IF NOT EXISTS "device_name" ON "device" (
                "name"
            );
            CREATE INDEX IF NOT EXISTS "device_type" ON "device" (
                "type"
            );
            CREATE INDEX IF NOT EXISTS "device_event_id" ON "device" (
                "event_id"
            );
        `);
    },

    createTicket: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "ticket" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "server_id"	INTEGER DEFAULT NULL,
                "event_id"	INTEGER NOT NULL,
                "category_id"	INTEGER NOT NULL,
                "status_id"	INTEGER NOT NULL,
                "status_text"	VARCHAR DEFAULT NULL,
                "cod"	VARCHAR NOT NULL,
                "image"	VARCHAR DEFAULT NULL,
                "multipass"	TINYINT NOT NULL DEFAULT 0,
                "active"	TINYINT NOT NULL DEFAULT 1,
                "device_id"	INTEGER DEFAULT NULL,
                "client_sync_id"	INTEGER NOT NULL,
                "reading_at"	DATETIME DEFAULT NULL,
                "created_at"	DATETIME NOT NULL,
                "updated_at"	DATETIME DEFAULT NULL,
                "deleted_at"	DATETIME DEFAULT NULL,
                "send_at"	DATETIME DEFAULT NULL,
                "sync"	INTEGER DEFAULT NULL,
                CONSTRAINT "ticket_status_id_foreign" FOREIGN KEY("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "ticket_device_id_foreign" FOREIGN KEY("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "ticket_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );
            
            CREATE UNIQUE INDEX IF NOT EXISTS "ticket_cod_event_id" ON "ticket" (
                "cod",
                "event_id"
            );
            CREATE INDEX IF NOT EXISTS "ticket_deleted_at" ON "ticket" (
                "deleted_at"
            );
            CREATE INDEX IF NOT EXISTS "ticket_reading_at" ON "ticket" (
                "reading_at"
            );
            CREATE INDEX IF NOT EXISTS "ticket_send_at" ON "ticket" (
                "send_at"
            );
            CREATE INDEX IF NOT EXISTS "ticket_cod" ON "ticket" (
                "cod"
            );
            CREATE INDEX IF NOT EXISTS "ticket_status_id" ON "ticket" (
                "status_id"
            );
            CREATE INDEX IF NOT EXISTS "ticket_device_id" ON "ticket" (
                "device_id"
            );
            CREATE INDEX IF NOT EXISTS "ticket_server_id" ON "ticket" (
                "server_id"
            );
            CREATE INDEX IF NOT EXISTS "ticket_event_id" ON "ticket" (
                "event_id"
            );
        `);
    },

    createField: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "field" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "event_id"	INTEGER NOT NULL,
                "type"	TEXT NOT NULL DEFAULT 'STRING',
                "name"	VARCHAR NOT NULL,
                "label"	VARCHAR NOT NULL,
                "vls"	VARCHAR DEFAULT NULL,
                "placeholder"	VARCHAR DEFAULT NULL,
                "mask"	VARCHAR DEFAULT NULL,
                "required"	TINYINT NOT NULL DEFAULT 0,
                "sequence"	INTEGER NOT NULL DEFAULT 0,
                CONSTRAINT "field_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );
            
            CREATE INDEX IF NOT EXISTS "field_sequence" ON "field" (
                "sequence"
            );
            CREATE INDEX IF NOT EXISTS "field_name" ON "field" (
                "name"
            );
            CREATE INDEX IF NOT EXISTS "field_type" ON "field" (
                "type"
            );
            CREATE INDEX IF NOT EXISTS "field_event_id" ON "field" (
                "event_id"
            );
        `);
    },

    createFieldValue: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "field_value" (
                "field_id"	INTEGER NOT NULL,
                "ticket_id"	INTEGER NOT NULL,
                "value"	VARCHAR DEFAULT NULL,
                CONSTRAINT "field_value_ticket_id_foreign" FOREIGN KEY("ticket_id") REFERENCES "ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "field_value_field_id_foreign" FOREIGN KEY("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );
            
            CREATE INDEX IF NOT EXISTS "field_value_value" ON "field_value" (
                "value"
            );
            CREATE INDEX IF NOT EXISTS "field_value_ticket_id" ON "field_value" (
                "ticket_id"
            );
            CREATE INDEX IF NOT EXISTS "field_value_field_id" ON "field_value" (
                "field_id"
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "field_value_field_id_ticket_id" ON "field_value" (
                "field_id",
                "ticket_id"
            );
        `);
    },

    createUser: ()=> {
        inittable.db.exec(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "event_id"	INTEGER NOT NULL,
                "type"	TEXT NOT NULL,
                "name"	VARCHAR NOT NULL,
                "login"	VARCHAR NOT NULL,
                "pass"	VARCHAR DEFAULT NULL,
                "active"	TINYINT NOT NULL DEFAULT 1,
                CONSTRAINT "user_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            );

            CREATE INDEX IF NOT EXISTS "user_pass" ON "user" (
                "pass"
            );
            CREATE INDEX IF NOT EXISTS "user_login" ON "user" (
                "login"
            );
            CREATE INDEX IF NOT EXISTS "user_name" ON "user" (
                "name"
            );
            CREATE INDEX IF NOT EXISTS "user_type" ON "user" (
                "type"
            );
            CREATE INDEX IF NOT EXISTS "user_event_id" ON "user" (
                "event_id"
            );
        `);
    },
}

export default inittable