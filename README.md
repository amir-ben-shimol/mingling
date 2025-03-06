# Mingling Monorepo

Welcome to **Mingling** – a microservices-based architecture with a React Native application for real-time streaming, matching, and collaboration. This monorepo is managed with **pnpm** and leverages Docker for containerization and orchestration.

---

## Overview

Mingling aims to let users:

-   Discover other **available users** in the app.
-   **Connect** via peer-to-peer stream connections using WebRTC and sockets.
-   Create **group calls** and collaborate with multiple participants in a multi-peer streaming environment.

The main use cases revolve around:

1. **Peer-to-Peer Matching**: Users can find each other and immediately establish a direct stream connection.
2. **Group Collaboration**: Users can invite others to join a multi-user call, watch for new available users, and co-participate in real-time streams.
3. **Live Notifications**: Participants stay updated with friend requests, acceptance, and real-time system notifications.

---

## Repository Structure

A high-level layout of the monorepo:

```
mingling/
├─ apps/
│  ├─ api-gateway/           # All requests pass through this service
│  ├─ friend-service/        # Manages friend interactions (requests, etc.)
│  ├─ mobile/                # React Native mobile app for streaming
│  ├─ notification-service/  # Handles user notifications (push, email, etc.)
│  └─ user-service/          # Manages user CRUD and related logic
├─ packages/
│  ├─ database/              # Common DB connection logic
│  ├─ rabbitmq/              # Common RabbitMQ utility package
│  ├─ redis/                 # Common Redis utility package
│  ├─ socket/                # Shared socket (WebSocket/Socket.io) utilities
│  └─ types/                 # Shared TypeScript types and interfaces
├─ data/
│  └─ videos/                # Local video storage
├─ docker/
│  └─ ...                    # Docker Compose and Dockerfiles
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md                 # This file
```

### **apps/**

-   **api-gateway**: Entry point for external requests. Routes traffic to the appropriate microservice.
-   **friend-service**: Handles friend-related logic, including friend requests, acceptances, blocking/unblocking, etc.
-   **mobile**: The main React Native project, enabling users to:
    -   Discover other available users.
    -   Initiate peer-to-peer calls or group streams.
    -   Receive real-time interactions via sockets and WebRTC.
-   **notification-service**: Takes care of pushing notifications (in-app, email, or other channels) to users.
-   **user-service**: Manages user data (registration, login, profile updates, etc.).

### **packages/**

-   **database**: Shared logic for connecting to the project’s database (e.g., PostgreSQL, MongoDB).
-   **rabbitmq**: Provides helper functions or classes to interact with RabbitMQ for message-passing across microservices.
-   **redis**: Manages Redis connections, useful for caching, session storage, or queue management.
-   **socket**: Houses reusable socket configurations and logic (Socket.io, WebSocket, etc.) for real-time communication across multiple services.
-   **types**: Contains **TypeScript** interfaces, type definitions, and models shared among services, ensuring consistency.

### **data/videos/**

-   A directory for local video files, which might be used for testing, demos, or content storage.

---

## How the App Works (High Level)

1. **User Login & Profile Management**: Managed by the **user-service**.
2. **Friend Management**: Users can send/receive friend requests, handled by **friend-service**.
3. **Real-Time Notifications**: The **notification-service** pushes updates about friend requests, calls, and other events.
4. **Match & Stream**: Through the **mobile** app, users can:
    - Look for available users.
    - Establish a **peer-to-peer** or **multi-user** call (using **WebRTC** and the **socket** package).
    - Optionally record or share local videos stored under `/data/videos`.
5. **API Gateway**: The **api-gateway** routes incoming requests (REST or possibly GraphQL) to the correct microservice.

---

## Requirements

1. **Node.js v20+**

    - Install Node.js 20 or later on your system.

2. **pnpm v9+**

    - Install pnpm globally:
        ```bash
        npm install -g pnpm
        ```

3. **Docker**
    - Ensure Docker is installed and running if you plan on using the container-based workflow.

---

## Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/amir-ben-shimol/mingling.git
    cd mingling
    ```

2. **Install Dependencies**:

    ```bash
    pnpm install
    ```

---

## Usage

### 1. Start All Services (Cluster Mode)

To spin up all services and infrastructure via Docker, run:

```bash
pnpm cluster:start
```

-   Make sure Docker is running before executing this command.
-   This command typically leverages Docker Compose to orchestrate microservices.

### 2. Run Individual Services Locally

You can also run each service manually. For example:

```bash
cd apps/api-gateway
pnpm dev
```

Repeat similarly for other services (`friend-service`, `notification-service`, `user-service`, etc.) if you need them running locally without Docker.

### 3. React Native Mobile App

Within `apps/mobile`, you can:

1. Start the React Native Metro server:
    ```bash
    npx expo run:ios
    ```

Ensure you have the required emulators or physical devices set up.

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify this code as needed.

---
