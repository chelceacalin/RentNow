# Rent Now

A comprehensive system for managing book rentals, categories, and user interactions within a corporate environment. This
application supports personalized recommendations, reviews, notifications, and more, making it easy for users to rent,
review, and discover books while providing admins with extensive management capabilities.

## Features

### 1. Book Management

- Admins can manage book details, including adding, editing, and organizing books.
- Set book availability and update information as needed.

### 2. Category Management

- Organize books into categories, allowing users to easily browse and explore based on specific interests.

### 3. Book Rental

- Admins add books they oversee, which users can request to rent.
- Admins can approve or reject rental requests, with the option to provide a reason for rejection.
- Also they are able to confirm book returns

### 4. Reading Recommendations

- Users receive personalized book recommendations based on their reading history.

### 5. Book Reviews and Comments

- Users can leave reviews, add ratings, and comment on books after returning them.
- Comment threads support recursive replies, allowing interaction with other users.

### 6. Filtering, Pagination, and Sorting

- Supports server-side filtering, pagination, and sorting using the **Specification API**, enhancing data retrieval
  efficiency.

### 7. User Roles and Permissions

- Role-based access control enables admins to manage users, categories, and permissions.
- Admins can create categories, add books, deactivate user accounts, generate reports and handle rental requests.

### 8. Notifications

Users receive various notifications:

- **Return Reminder**: Notified one day before the return due date.
- **Overdue Reminder**: Daily notifications for overdue books.
- **Rental Confirmation**: Both the renter and owner are notified upon rental approval.
- **Rejection Notification**: Email notification with rejection reasons if a rental request is denied.
- **Newsletter Notification**: Weekly notifications with book recommendations

### 9. Configurations

- Users can set preferences for receiving email notifications and managing newsletter subscriptions.

### 10. Cleanup Jobs

- Background cron jobs send newsletter emails to users.
- Automatically deletes pending rental requests older than 24 hours.

### 11. Monitoring

- Integrated with **Grafana** for real-time monitoring using pre-configured dashboards.
- Log collection is managed via **Loki** and **Prometheus**, providing efficient visualization and tracking.

### 12. Reporting

- Generate PDF reports on rented books.
- Admins can view reports to apply penalties for missed return deadlines.

### 13. ChatBot

- A Chat Widget powered by **RAG Architecture** (Retrieval-Augmented Generation).
- The chatbot includes predefined answers and allows admins to add custom responses dynamically.

### 14. Link Utils
- Admins can create and edit utility links, directing users to internal pages or external sites.

### 15. Microservices
- The app is split into 4 microservices: core ( most of the logic ), notification_service ( for sending emails to users), reports_service( for generating user reports ) and rag_module ( for chatbot and book recommendations )
- Then we have the front_end, and common module

## Technologies

- **Backend**: Spring Boot 3, Java 21, Python
- **Authentication**: Google Login, GitHub Login
- **Frontend**: React JS, Tailwind CSS, SCSS, Material UI
- **Databases**: Postgres, ChromaDB
- **Database Migrations**: Flyway
- **Image Storage**: Minio
- **Monitoring**: Loki (logs), Prometheus (metrics)
- **Dashboards**: Grafana
- **Email Service**: Gmail SMTP

## Getting Started

### Prerequisites

- Java 21
- Docker and Docker Compose
- NodeJs

### Running the App

1. **Clone the repository**:
    ```bash
    git clone https://github.com/chelceacalin/RentNow.git
    cd RentNow
    ```

2. **Start the core service** using Docker Compose:
    ```bash
    cd core
    docker-compose up
   ./mvnw spring-boot:run
    ```

3. **Start the notification_service**:
    ```bash
    cd notification_service
    ./mvnw spring-boot:run
    ```

4. **Start the front-end**:
    ```bash
    cd front_end
    npm install --legacy-peer-deps
    npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
    npm install @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome --legacy-peer-deps
    cd src
    npm run start
    ```
5. **Start the python app**
    ```
    cd .\Rag_Service\
    docker compose up
    pip install -r requirements.txt
    python main.py
    ```

### Access Points (local)

- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **React Frontend**: [http://localhost:4173](http://localhost:4173)
- **Minio Server**: [http://localhost:9000](http://localhost:9090)
- **Minio Console**: [http://localhost:9001](http://localhost:9001)
- **Server Health**: [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
- **Grafana**: [http://localhost:3000](http://localhost:3000) (default credentials: admin/admin)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Postgres Exporter**: [http://localhost:9187/](http://localhost:9187/)

### Documentation

- **JSON API Documentation**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **UI Interface API Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Actuator**: [http://localhost:8081/actuator](http://localhost:8081/actuator)