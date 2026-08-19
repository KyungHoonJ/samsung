-- CreateTable
CREATE TABLE `consultations` (
    `id` CHAR(36) NOT NULL,
    `public_id` VARCHAR(32) NOT NULL,
    `category` ENUM('ARTICLES_OF_INCORPORATION', 'INHERITANCE', 'OTHER') NOT NULL,
    `name_encrypted` TEXT NOT NULL,
    `phone_encrypted` TEXT NOT NULL,
    `phone_search_hash` CHAR(64) NOT NULL,
    `region_level_1` VARCHAR(50) NOT NULL,
    `region_level_2` VARCHAR(50) NULL,
    `preferred_place` VARCHAR(100) NULL,
    `preferred_contact_time` VARCHAR(50) NULL,
    `inquiry_encrypted` TEXT NOT NULL,
    `status` ENUM('NEW', 'CONTACT_SCHEDULED', 'CONTACTED', 'APPOINTMENT_BOOKED', 'COMPLETED', 'CONTRACT_IN_PROGRESS', 'CLOSED', 'UNREACHABLE', 'PENDING_DELETION') NOT NULL DEFAULT 'NEW',
    `privacy_consent_version` VARCHAR(30) NOT NULL,
    `privacy_consent_at` DATETIME(3) NOT NULL,
    `retention_expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `consultations_public_id_key`(`public_id`),
    INDEX `consultations_status_created_at_idx`(`status`, `created_at`),
    INDEX `consultations_category_created_at_idx`(`category`, `created_at`),
    INDEX `consultations_retention_expires_at_idx`(`retention_expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
