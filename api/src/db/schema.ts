import { bigint, boolean, datetime, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const tarjetas = mysqlTable("tarjetas", {
    id: bigint("id", { mode: "number", unsigned: true })
        .autoincrement()
        .primaryKey(),
    codigoTarjeta: varchar("codigo_tarjeta", { length: 256 }).notNull().unique(),
    nombreUsuario: varchar("nombre_usuario", { length: 256 }).notNull(),
    activo: boolean("activo").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const historial = mysqlTable("historial", {
    id: bigint("id", { mode: "number", unsigned: true })
        .autoincrement()
        .primaryKey(),
    codigoTarjeta: varchar("codigo_tarjeta", { length: 256 }).notNull(),
    fechaHora: timestamp("fecha_hora").defaultNow().notNull(),
    resultado: varchar("resultado", { length: 256 }).notNull(),
}) 