CREATE TABLE `historial` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`codigo_tarjeta` varchar(256) NOT NULL,
	`fecha_hora` timestamp NOT NULL DEFAULT (now()),
	`resultado` varchar(256) NOT NULL,
	CONSTRAINT `historial_id` PRIMARY KEY(`id`),
	CONSTRAINT `historial_codigo_tarjeta_unique` UNIQUE(`codigo_tarjeta`)
);
--> statement-breakpoint
CREATE TABLE `tarjetas` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`codigo_tarjeta` varchar(256) NOT NULL,
	`nombre_usuario` varchar(256) NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tarjetas_id` PRIMARY KEY(`id`),
	CONSTRAINT `tarjetas_codigo_tarjeta_unique` UNIQUE(`codigo_tarjeta`)
);
