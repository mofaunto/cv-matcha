CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `attributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`options` text,
	`is_built_in` integer DEFAULT false NOT NULL,
	`max_length` integer,
	`regex` text,
	`min` real,
	`max` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attributes_name_unique` ON `attributes` (`name`);--> statement-breakpoint
CREATE TABLE `user_profile_attributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`attribute_id` integer NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`value_string` text,
	`value_text` text,
	`value_image_url` text,
	`value_numeric` real,
	`value_date` integer,
	`value_boolean` integer,
	`value_option` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uix_user_attribute` ON `user_profile_attributes` (`user_id`,`attribute_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_tags` (
	`project_id` integer NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`project_id`, `tag`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`short_description` text NOT NULL,
	`access_rules` text DEFAULT '[]' NOT NULL,
	`max_projects` integer DEFAULT 3 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `position_attributes` (
	`position_id` integer NOT NULL,
	`attribute_id` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`position_id`, `attribute_id`),
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `position_project_tags` (
	`position_id` integer NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`position_id`, `tag`),
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cvs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` text NOT NULL,
	`position_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`candidate_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uix_candidate_position` ON `cvs` (`candidate_id`,`position_id`);--> statement-breakpoint
CREATE TABLE `discussion_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`cv_id` integer NOT NULL,
	`recruiter_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`cv_id`, `recruiter_id`),
	FOREIGN KEY (`cv_id`) REFERENCES `cvs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recruiter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
