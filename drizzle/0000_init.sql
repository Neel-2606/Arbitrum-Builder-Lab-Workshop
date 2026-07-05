CREATE TABLE `saved_chains` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`blocks_json` text NOT NULL,
	`difficulty` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`coin_id` text NOT NULL,
	`added_at` integer NOT NULL
);
