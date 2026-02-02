
![image](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FlP6cT-0rpx0AAAAC%2Fmark-zuckerberg.gif&f=1&nofb=1&ipt=b293fec11523570b1f076cfff29b4a275a2634db478573af86fe5259931590dc)

Project: [https://lilac-bromine-67e.notion.site/Projet-Full-Stack-FlashMind-Flashcards-Quiz-IA-2f5ee7337bbf808faf35c78fc24d39ee](https://lilac-bromine-67e.notion.site/In-Memory-of-Gojo-2f6ee7337bbf80079c13d1c27f4eb0e4)

Techno used: Node.JS express cors, React.JS vite, Docker, MariaDb, Cypress.

---

### Base project structure to create:

```
JobPrep-AI/
│
├── docker-compose.yml          # Main orchestration (App, DB, UI)
├── docker-compose.override.yml # Dev orchestration
├── docker-compose.prod.yml     # Prod orchestration
├── .gitignore                  # Files to ignore by Git for fapout 69
├── README.md                   # Project documentation
│
├── secrets/                    # Folder (Security)
│   ├── api_key.txt             # Content: secret_api_key
│   ├── db_name.txt             # Content: jobprep
│   ├── db_password.txt         # Content: user_password
│   ├── db_root_password.txt    # Content: root_password_super_secure
│   ├── db_user.txt             # Content: jobprep_user
│   └── jwt_secret.txt          # Content: passphrase_jwt
│
├── database/
│   └── init.sql                # SQL Initialisation Script
│
├── api/                        # BACKEND (Node/Express)
│   ├── Dockerfile              # Instruction to build the Backend image
│   ├── package.json
│   ├── package-lock.json       # Will be genereted after npm install
│   └── src/                    # Backend source code directory
│       └── server.js            # API Entry point
│
├── app/                        # FRONTEND (React/Vite) 
│   ├── Dockerfile              # Instruction to build the Frontend image
│   ├── package.json
│   ├── package-lock.json       # Will be generated after npm install
│   ├── vite.config.js
│   └── src/                    # Frontend source code directory
│       ├── main.jsx
│       └── App.jsx
│
└── cypress/                    # Tests E2E
    ├── Dockerfile              # Instruction to build the Test image
    ├── cypress.config.js
    ├── e2e/
    │   └── example.cy.js
    ├── fixtures/
    └── support/
        ├── commands.js
        └── e2e.js
```

---

### .gitignore

```git
# Dependencies
node_modules/
package-lock.json

# Secrets - Never Commit This !!!
secrets/
*.txt

# Environment variables
.env
*.env

# Docker volumes
data/

# OS
.DS_Store # For mac os
Thumbs.db # For windows

# Logs
*.log
```

---

### How Docker Orchestrates Our Services

Our `docker-compose.yml` will define three services that work together:
	- The `Database` using MariaDB, `Port 3306` and store the users data permanently.
	- The `API` using Node.JS + Express, `Port 5000 `and handles business logic & API endpoints.
	- The APP using React.JS + vite, `Port 3000` and do the users interfaces (forms and displays).

---

#### Outdated docker-compose.yml (avec cypress)

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: development
    container_name: jobprep_api
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - PORT=5000
      - DB_HOST=mariadb
      - DB_PORT=3306
      - DB_USER_FILE=/run/secrets/db_user
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - DB_NAME_FILE=/run/secrets/db_name
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
      - AI_API_KEY_FILE=/run/secrets/api_key
    ports:
      - "5000:5000"
    secrets:
      - db_user
      - db_password
      - db_name
      - jwt_secret
      - api_key
    volumes:
      - ./api/src:/app/src
      - ./api/package.json:/app/package.json
      - ./api/package-lock.json:/app/package-lock.json
      - api_node_modules:/app/node_modules
    depends_on:
      mariadb:
        condition: service_healthy
    networks:
      - jobprep_private_network
      - jobprep_public_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: development
    container_name: jobprep_app
    restart: unless-stopped
    environment:
      - VITE_API_URL=http://localhost:5000/api
    ports:
      - "3000:3000"
    volumes:
      - ./app/src:/app/src
      - ./app/package.json:/app/package.json
      - ./app/package-lock.json:/app/package-lock.json
      - app_node_modules:/app/node_modules
    depends_on:
      api:
        condition: service_healthy
    networks:
      - jobprep_public_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

  mariadb:
    image: mariadb:lts-alpine
    container_name: jobprep_db
    restart: unless-stopped
    environment:
      - MARIADB_USER_FILE=/run/secrets/db_user
      - MARIADB_PASSWORD_FILE=/run/secrets/db_password
      - MARIADB_DATABASE_FILE=/run/secrets/db_name
      - MARIADB_ROOT_PASSWORD_FILE=/run/secrets/db_root_password
    ports:
      - "3306:3306"
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - jobprep_private_network
    secrets:
      - db_user
      - db_password
      - db_name
      - db_root_password
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      start_period: 10s
      interval: 10s
      timeout: 5s
      retries: 3

  cypress:
    build:
      context: ./cypress
      dockerfile: Dockerfile
    container_name: jobprep_cypress
    environment:
      - CYPRESS_baseUrl=http://app:3000
      - CYPRESS_apiUrl=http://api:5000/api
    working_dir: /app
    volumes:
      - ./cypress/e2e:/app/cypress/e2e
      - ./cypress/fixtures:/app/cypress/fixtures
      - ./cypress/support:/app/cypress/support
      - ./cypress/cypress.config.js:/app/cypress.config.js
      - ./cypress/screenshots:/app/cypress/screenshots
      - ./cypress/videos:/app/cypress/videos
    depends_on:
      app:
        condition: service_healthy
      api:
        condition: service_healthy
    networks:
      - jobprep_public_network
    profiles:
      - testing

volumes:
  mariadb_data:
  api_node_modules:
  app_node_modules:
  cypress_results:
  cypress_screenshots:
  cypress_videos:

networks:
  jobprep_private_network:
    internal: true
  jobprep_public_network:

secrets:
  db_user:
    file: ./secrets/db_user.txt
  db_password:
    file: ./secrets/db_password.txt
  db_name:
    file: ./secrets/db_name.txt
  db_root_password:
    file: ./secrets/db_root_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  api_key:
    file: ./secrets/api_key.txt
```

---

#### docker-compose.yml

```yaml
services:
  api:
    container_name: jobprep_api
    secrets:
      - db_user
      - db_password
      - db_name
      - jwt_secret
      - api_key
    networks:
      - jobprep_private_network
      - jobprep_public_network
    depends_on:
      mariadb:
        condition: service_healthy

  app:
    container_name: jobprep_app
    networks:
      - jobprep_public_network
    depends_on:
      api:
        condition: service_healthy

  mariadb:
    image: mariadb:lts
    container_name: jobprep_db
    environment:
      - MARIADB_USER_FILE=/run/secrets/db_user
      - MARIADB_PASSWORD_FILE=/run/secrets/db_password
      - MARIADB_DATABASE_FILE=/run/secrets/db_name
      - MARIADB_ROOT_PASSWORD_FILE=/run/secrets/db_root_password
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - jobprep_private_network
    secrets:
      - db_user
      - db_password
      - db_name
      - db_root_password
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      start_period: 10s
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mariadb_data:
  api_node_modules:
  app_node_modules:
  cypress_results:
  cypress_screenshots:
  cypress_videos:

networks:
  jobprep_private_network:
    internal: true
  jobprep_public_network:

secrets:
  db_user:
    file: ./secrets/db_user.txt
  db_password:
    file: ./secrets/db_password.txt
  db_name:
    file: ./secrets/db_name.txt
  db_root_password:
    file: ./secrets/db_root_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  api_key:
    file: ./secrets/api_key.txt
```

#### docker-compose.override.yml

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: development
    restart: no
    environment:
      - NODE_ENV=development
      - PORT=5000
      - DB_HOST=mariadb
      - DB_PORT=3306
      - DB_USER_FILE=/run/secrets/db_user
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - DB_NAME_FILE=/run/secrets/db_name
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
      - AI_API_KEY_FILE=/run/secrets/api_key
    ports:
      - "5000:5000"
    volumes:
      - ./api/src:/app/src
      - ./api/package.json:/app/package.json
      - ./api/package-lock.json:/app/package-lock.json
      - api_node_modules:/app/node_modules
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: development
    restart: no
    environment:
      - VITE_API_URL=http://localhost:5000/api 
    ports:
      - "3000:3000"
    volumes:
      - ./app/src:/app/src
      - ./app/package.json:/app/package.json
      - ./app/package-lock.json:/app/package-lock.json
      - app_node_modules:/app/node_modules
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

  mariadb:
    ports:
      - "3306:3306"

  cypress:
    build:
      context: ./cypress
      dockerfile: Dockerfile
    container_name: jobprep_cypress
    environment:
      - CYPRESS_baseUrl=http://app:3000
      - CYPRESS_apiUrl=http://api:5000/api
    working_dir: /app
    volumes:
      - ./cypress/e2e:/app/cypress/e2e
      - ./cypress/fixtures:/app/cypress/fixtures
      - ./cypress/support:/app/cypress/support
      - ./cypress/cypress.config.js:/app/cypress.config.js
      - ./cypress/screenshots:/app/cypress/screenshots
      - ./cypress/videos:/app/cypress/videos
    depends_on:
      app:
        condition: service_healthy
      api:
        condition: service_healthy
    networks:
      - jobprep_public_network
    profiles:
      - testing
```

#### docker-compose.prod.yml

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: production
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=mariadb
      - DB_PORT=3306
      - DB_USER_FILE=/run/secrets/db_user
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - DB_NAME_FILE=/run/secrets/db_name
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
      - AI_API_KEY_FILE=/run/secrets/api_key
    ports:
      - "5000:5000"

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: production
    restart: always
    environment:
      - VITE_API_URL=http://votre-domaine.com/api 
    ports:
      - "80:3000"

  mariadb:
    restart: always
```

Template:
source: https://github.com/docker/awesome-compose/blob/master/react-express-mysql/compose.yaml

Multi-Stage:
source: https://docs.docker.com/build/building/multi-stage/

Structure:
source: https://hub.docker.com/_/mariadb
source: https://www.geeksforgeeks.org/devops/docker-compose-yaml-explained-a-deep-dive-into-configuration/

Network:
source: https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/installing-and-using-mariadb-via-docker

Health check:
source: https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/using-healthcheck-sh

Secrets:
source: https://docs.docker.com/engine/swarm/secrets/

Cypress:
source: https://github.com/cypress-io/cypress-example-kitchensink/tree/master
source: https://docs.cypress.io/app/continuous-integration/overview#Cypress-Docker-variants
source: https://docs.cypress.io/app/core-concepts/writing-and-organizing-tests

---

### API DOCKERFILE

```dockerfile
FROM node:lts-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm ci --include=dev

EXPOSE 5000 

CMD ["npm", "run", "dev"]

FROM base AS deps-prod

RUN npm ci --omit=dev

FROM node:lts-alpine AS production

RUN apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs && adduser -S expressjs -u 1001 -G nodejs

WORKDIR /app

COPY --from=deps-prod --chown=expressjs:nodejs /app/node_modules ./node_modules

COPY --chown=expressjs:nodejs ./src ./src 
COPY --chown=expressjs:nodejs package*.json ./

USER expressjs

EXPOSE 5000

CMD ["node", "src/server.js"]
```

### APP DOCKERFILE

```dockerfile
FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN npm ci 

COPY . .

EXPOSE 3000
CMD ["npm", "start" ]

FROM base AS build
RUN npm ci 
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

Dockerfile:
source: https://dev.to/minima_desk_cd9b151c4e2fb/dockerize-your-nodejs-application-a-step-by-step-guide-iel
source: https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
source: https://stackoverflow.com/questions/49594501/copy-package-json-dockerfile
source: https://medium.com/@muhammadnaqeeb/dockerizing-a-node-js-and-express-js-app-9cb31cf9139e

npm-ci:
source: https://docs.npmjs.com/cli/v10/commands/npm-ci?v=true

Best Practice:
source: https://www.docker.com/blog/docker-best-practices-choosing-between-run-cmd-and-entrypoint/

---

### MariaDB

```sql
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
```


### API Mammouth AI: GPT-4:

``` docker
const fetch = require("node-fetch");

async function callMammouth() {
  const url = "https://api.mammouth.ai/v1/chat/completions";
  const headers = {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  };

  const data = {
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: "Create an example JavaScript function",
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

callMammouth();
```

---

If my server code is in the client folder, a user could find my MariaDB password or Gemini API key by inspecting the web page code.

Why separate client and server:

|                    | Client file (React)                                                | Server folder (Node/Express)                        |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------------------- |
| Where does it run? | In the user's browser (Chrome, Firefox).                           | On your machine (or a cloud server).                |
| Data access        | Only sees what is sent to it. Cannot access the database directly. | Has direct access to MariaDB and API keys (Gemini). |
| Security           | Code visible to everyone (Right-click -> Inspect).                 | Private and secure code.                            |
| Role               | Display, animations, user interaction.                             | Logic, calculations, storage, security.             |

source: https://vite.dev/guide/#scaffolding-your-first-vite-project
source: https://expressjs.com/en/starter/generator.html
source: https://12factor.net/fr/

---

Dependencies to install: express (API REST), mariadb (mariadb), cors (cross-origin requests)

source: https://medium.com/@qservicesinc/creating-a-full-stack-application-with-node-js-express-and-react-2bfd115ce62e

---

Connect MariaDB to Node.js: https://mariadb.com/docs/connectors/connectors-quickstart-guides/connector-node.js-guide 

---

Tasks:
- Create a git repository
- Create the root folder
- Initialize the frontend (react)
- Initialize the backend (node)

Phases:
1. Prepare MariaDB
2. Prepare the Backend
3. Prepare the frontend


docker-secret:
source: https://www.npmjs.com/package/docker-secret

![[Pasted image 20260202122614.png]]