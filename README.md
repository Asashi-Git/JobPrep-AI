Minimal or no utilization of AI (only to explain concepts). ps: no skill in react, and basics in javascript.

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
# ------------------------------

#STAGE 1 étape de base commune
FROM node:lts-alpine AS base

# Installation de curl pour le HEALTHCHECK défini dans votre docker-compose
RUN apk add --no-cache curl

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# ------------------------------

# 1. Installation des dépendances
COPY package*.json ./

#STAGE 2 étape de développement 
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --include=dev

# 2. Copie du code source
COPY . .

EXPOSE 3000 
CMD ["npx" , "nodemon", "src/server.js"] # nom du fichier node

#STAGE 3 étape de production
FROM base AS production
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
USER node

#Copie du code source
COPY . .

EXPOSE 3000
CMD ["dumb-init", "node", "src/server.js"]
```

npm-ci:
source: https://docs.npmjs.com/cli/v10/commands/npm-ci?v=true








```dockerfile
From node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN npm ci --include=dev

COPY . .

EXPOSE 5000
CMD ["npm", "start" ]

FROM base AS build
RUN npm ci --include=build
COPY . .
RUN npm build

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


```






```yaml
# Étape de base commune
FROM node:lts-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# Étape de développement
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["dumb-init", "node", "--watch", "src/server.js"]

# Étape de production
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
USER node
CMD ["dumb-init", "node", "src/server.js"]
```

Dockerfile:
source: https://dev.to/minima_desk_cd9b151c4e2fb/dockerize-your-nodejs-application-a-step-by-step-guide-iel
source: https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
source: https://stackoverflow.com/questions/49594501/copy-package-json-dockerfile
source: https://medium.com/@muhammadnaqeeb/dockerizing-a-node-js-and-express-js-app-9cb31cf9139e

---

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