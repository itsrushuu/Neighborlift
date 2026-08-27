CREATE TABLE `helpMatches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`offerId` int NOT NULL,
	`compatibilityScore` int NOT NULL,
	`reasons` text NOT NULL,
	`aiExplanation` text,
	`status` enum('proposed','matched','completed','declined') NOT NULL DEFAULT 'proposed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `helpMatches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `helpPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`kind` enum('request','offer') NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`displayName` varchar(80) NOT NULL,
	`category` enum('groceries','rides','tutoring','translation','accessibility') NOT NULL,
	`urgency` enum('flexible','this_week','today') NOT NULL,
	`approximateArea` varchar(120) NOT NULL,
	`skills` text NOT NULL,
	`availability` varchar(180) NOT NULL,
	`accessibilityNotes` text,
	`status` enum('open','matched','completed','closed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `helpPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `helpMatches` ADD CONSTRAINT `helpMatches_requestId_helpPosts_id_fk` FOREIGN KEY (`requestId`) REFERENCES `helpPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `helpMatches` ADD CONSTRAINT `helpMatches_offerId_helpPosts_id_fk` FOREIGN KEY (`offerId`) REFERENCES `helpPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `helpPosts` ADD CONSTRAINT `helpPosts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;