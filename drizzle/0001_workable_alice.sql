CREATE TABLE `delivery_banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`placement` enum('homepage','product','cart','global') NOT NULL DEFAULT 'global',
	`isActive` boolean NOT NULL DEFAULT true,
	`backgroundColor` varchar(20) DEFAULT '#1a1a2e',
	`textColor` varchar(20) DEFAULT '#ffffff',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `delivery_banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`subject` varchar(255),
	`message` text NOT NULL,
	`source` enum('contact_form','mobile_showroom','manual') NOT NULL DEFAULT 'contact_form',
	`status` enum('new','replied','closed') NOT NULL DEFAULT 'new',
	`aiDraftReply` text,
	`ownerReply` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shopify_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shop` varchar(255) NOT NULL,
	`accessToken` text NOT NULL,
	`scope` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shopify_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `shopify_tokens_shop_unique` UNIQUE(`shop`)
);
--> statement-breakpoint
CREATE TABLE `showroom_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`district` varchar(255) NOT NULL,
	`preferredDate` varchar(50) NOT NULL,
	`preferredTime` varchar(50) NOT NULL,
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `showroom_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `store_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`titleEs` varchar(255) NOT NULL,
	`contentEs` text NOT NULL,
	`shopifyPageId` varchar(100),
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `upsell_offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleEs` varchar(255) NOT NULL,
	`description` text,
	`descriptionEs` text,
	`category` enum('bed_frame','mattress_topper','pillow','other') NOT NULL,
	`shopifyProductId` varchar(100),
	`price` varchar(50),
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`triggerType` enum('post_purchase','cart','both') NOT NULL DEFAULT 'post_purchase',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `upsell_offers_id` PRIMARY KEY(`id`)
);
