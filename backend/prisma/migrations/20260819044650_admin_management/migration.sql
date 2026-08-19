-- CreateTable
CREATE TABLE `admins` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(50) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'MANAGER', 'CONSULTANT') NOT NULL DEFAULT 'CONSULTANT',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sessions` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_used_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_sessions_token_hash_key`(`token_hash`),
    INDEX `admin_sessions_admin_id_expires_at_idx`(`admin_id`, `expires_at`),
    INDEX `admin_sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultation_notes` (
    `id` CHAR(36) NOT NULL,
    `consultation_id` CHAR(36) NOT NULL,
    `author_admin_id` CHAR(36) NOT NULL,
    `content_encrypted` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `consultation_notes_consultation_id_created_at_idx`(`consultation_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_histories` (
    `id` CHAR(36) NOT NULL,
    `consultation_id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `type` ENUM('CALL', 'SMS', 'EMAIL', 'MEETING') NOT NULL,
    `result` VARCHAR(500) NULL,
    `contacted_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_histories_consultation_id_contacted_at_idx`(`consultation_id`, `contacted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NULL,
    `action` ENUM('LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'VIEW_LIST', 'VIEW_DETAIL', 'UPDATE_STATUS', 'CREATE_NOTE', 'CREATE_CONTACT', 'DELETE_CONSULTATION', 'CREATE_ADMIN', 'UPDATE_ADMIN', 'VIEW_AUDIT_LOG') NOT NULL,
    `target_type` VARCHAR(50) NOT NULL,
    `target_id` VARCHAR(64) NULL,
    `metadata` JSON NULL,
    `ip_address` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_admin_id_created_at_idx`(`admin_id`, `created_at`),
    INDEX `audit_logs_action_created_at_idx`(`action`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultation_notes` ADD CONSTRAINT `consultation_notes_consultation_id_fkey` FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultation_notes` ADD CONSTRAINT `consultation_notes_author_admin_id_fkey` FOREIGN KEY (`author_admin_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_histories` ADD CONSTRAINT `contact_histories_consultation_id_fkey` FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_histories` ADD CONSTRAINT `contact_histories_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
