ALTER TABLE `reservations` ADD `created_at` text DEFAULT '2024-09-22T10:31:34.110Z' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `updated_at` text DEFAULT '2024-09-22T10:31:34.110Z' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT '2024-09-22T10:31:34.109Z' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT '2024-09-22T10:31:34.109Z' NOT NULL;