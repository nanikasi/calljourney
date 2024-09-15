CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`time` text NOT NULL,
	`customer_count` integer NOT NULL,
	`status` text NOT NULL
);
