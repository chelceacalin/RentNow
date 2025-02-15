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
- The app is split into multiple microservices: 
  - Core: Most of the logic of the application
  - Notification_Service: Used for sending email notifications to users
  - Reports_Service: Used for generating PDF reports for users
  - Rag_Module: Used for chatbot and book recommendations
  - Front_End: Front end of application
- Utils:
  - Api_Server - Eureka Server to which microservices connect
  - Api_Gateway - Entrypoint of every request from front end and redirected to the proper microservice
  - Common - Common code for multiple microservices

## Technologies

- **Backend**: Spring Boot 3, Java 21, Python
- **Authentication**: Google Login, GitHub Login
- **Frontend**: React JS, Tailwind CSS, SCSS, Material UI
- **Databases**: Postgres, ChromaDB
- **Database Migrations**: Flyway
- **Image Storage**: Minio
- **Monitoring**: Loki (logs), Prometheus (metrics), Swagger
- **Dashboards**: Grafana
- **Email Service**: Gmail SMTP
- **Gateway**: Eureka Gateway

## Getting Started

### Prerequisites

- Java 21
- Docker and Docker Compose
- NodeJs
- Python 3

### Running the App

### Option 1:
 ```bash
 cd run
 ./run.sh
 ```

### Option 2:

1. **Start the api_server** using Docker Compose:
    ```bash
    cd api_server
    mvn spring-boot:run
    ```
2. **Start the api_gateway** using Docker Compose:
    ```bash
    cd api_gateway
    mvn spring-boot:run
    ```

3. **Start the core service** using Docker Compose:
    ```bash
    cd core
    mvn spring-boot:run
    ```

4. **Start the notification_service**:
    ```bash
    cd notification_service
    mvn spring-boot:run
    ```

5. **Start the reports_service**:
    ```bash
    cd reports_service
    mvn spring-boot:run
    ```
   
6. **Start the front_end**:
    ```bash
    cd front_end
    npm install --legacy-peer-deps
    npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
    npm install @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome --legacy-peer-deps
    cd src
    npm run start
    ```
7. **Start the rag_module service**
    ```
    cd .\rag_module\
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python3 main.py
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
- **Eureka Server**: [http://localhost:8761/](http://localhost:8761/)
- **Zipkin**: [http://localhost:9411/](http://localhost:9411/)
### Documentation

- **UI Interface API Documentation**: [http://localhost:8079/webjars/swagger-ui/index.html](http://localhost:8079/webjars/swagger-ui/index.html)
- **Actuator**: [http://localhost:8079/actuator](http://localhost:8081/actuator)