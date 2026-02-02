CREATE TABLE `user` (
  `id_user` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `api_usage` (
  `id_api_usage` integer PRIMARY KEY AUTO_INCREMENT,
  `tokens_input` integer NOT NULL,
  `tokens_output` integer NOT NULL,
  `tokens_total` integer NOT NULL,
  `cost_estimated` decimal(10,6) NOT NULL,
  `model_used` varchar(50),
  `created_at` timestamp DEFAULT (now()),
  `id_user` integer NOT NULL
);

CREATE TABLE `prompt_template` (
  `id_prompt_template` integer PRIMARY KEY AUTO_INCREMENT,
  `feature_type` varchar(50) NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `template_text` text NOT NULL,
  `version` varchar(20) NOT NULL,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `curriculum_vitae` (
  `id_curriculum_vitae` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(150),
  `input_data` text NOT NULL,
  `output_text` text NOT NULL,
  `output_format` varchar(20) DEFAULT 'markdown',
  `created_at` timestamp DEFAULT (now()),
  `id_user` integer NOT NULL,
  `id_prompt_template` integer NOT NULL,
  `id_api_usage` integer NOT NULL
);

CREATE TABLE `cover_letter` (
  `id_cover_letter` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(150),
  `target_company` varchar(150),
  `target_position` varchar(150),
  `input_data` text NOT NULL,
  `output_text` text NOT NULL,
  `output_format` varchar(20) DEFAULT 'markdown',
  `created_at` timestamp DEFAULT (now()),
  `id_user` integer NOT NULL,
  `id_prompt_template` integer NOT NULL,
  `id_api_usage` integer NOT NULL
);

CREATE TABLE `interview` (
  `id_interview` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(150),
  `level` varchar(30) NOT NULL,
  `interview_type` varchar(50),
  `target_position` varchar(150),
  `input_data` text NOT NULL,
  `output_text` text NOT NULL,
  `created_at` timestamp DEFAULT (now()),
  `id_user` integer NOT NULL,
  `id_prompt_template` integer NOT NULL,
  `id_api_usage` integer NOT NULL
);

CREATE TABLE `job_application` (
  `id_job_application` integer PRIMARY KEY AUTO_INCREMENT,
  `company_name` varchar(150) NOT NULL,
  `position` varchar(150) NOT NULL,
  `job_url` varchar(500),
  `status` varchar(30) NOT NULL DEFAULT 'DRAFT',
  `notes` text,
  `created_at` timestamp DEFAULT (now()),
  `applied_at` timestamp,
  `updated_at` timestamp,
  `id_user` integer NOT NULL,
  `id_curriculum_vitae` integer,
  `id_cover_letter` integer
);

CREATE UNIQUE INDEX `user_index_0` ON `user` (`email`);

CREATE INDEX `idx_usage_user_date` ON `api_usage` (`id_user`, `created_at`);

CREATE INDEX `idx_template_type_active` ON `prompt_template` (`feature_type`, `is_active`);

CREATE INDEX `idx_cv_user` ON `curriculum_vitae` (`id_user`);

CREATE INDEX `idx_letter_user` ON `cover_letter` (`id_user`);

CREATE INDEX `idx_interview_user` ON `interview` (`id_user`);

CREATE INDEX `idx_application_user` ON `job_application` (`id_user`);

CREATE INDEX `idx_application_user_status` ON `job_application` (`id_user`, `status`);

ALTER TABLE `api_usage` ADD CONSTRAINT `fk_api_usage_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `curriculum_vitae` ADD CONSTRAINT `fk_cv_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `curriculum_vitae` ADD CONSTRAINT `fk_cv_template` FOREIGN KEY (`id_prompt_template`) REFERENCES `prompt_template` (`id_prompt_template`) ON DELETE RESTRICT;

ALTER TABLE `curriculum_vitae` ADD CONSTRAINT `fk_cv_api_usage` FOREIGN KEY (`id_api_usage`) REFERENCES `api_usage` (`id_api_usage`) ON DELETE RESTRICT;

ALTER TABLE `cover_letter` ADD CONSTRAINT `fk_letter_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `cover_letter` ADD CONSTRAINT `fk_letter_template` FOREIGN KEY (`id_prompt_template`) REFERENCES `prompt_template` (`id_prompt_template`) ON DELETE RESTRICT;

ALTER TABLE `cover_letter` ADD CONSTRAINT `fk_letter_api_usage` FOREIGN KEY (`id_api_usage`) REFERENCES `api_usage` (`id_api_usage`) ON DELETE RESTRICT;

ALTER TABLE `interview` ADD CONSTRAINT `fk_interview_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `interview` ADD CONSTRAINT `fk_interview_template` FOREIGN KEY (`id_prompt_template`) REFERENCES `prompt_template` (`id_prompt_template`) ON DELETE RESTRICT;

ALTER TABLE `interview` ADD CONSTRAINT `fk_interview_api_usage` FOREIGN KEY (`id_api_usage`) REFERENCES `api_usage` (`id_api_usage`) ON DELETE RESTRICT;

ALTER TABLE `job_application` ADD CONSTRAINT `fk_application_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

ALTER TABLE `job_application` ADD CONSTRAINT `fk_application_cv` FOREIGN KEY (`id_curriculum_vitae`) REFERENCES `curriculum_vitae` (`id_curriculum_vitae`) ON DELETE SET NULL;

ALTER TABLE `job_application` ADD CONSTRAINT `fk_application_letter` FOREIGN KEY (`id_cover_letter`) REFERENCES `cover_letter` (`id_cover_letter`) ON DELETE SET NULL;