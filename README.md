# Rent Now

Rent Now facilitates book rentals within a company, allowing you to manage and share your book collection with colleagues.

## Features

- **Book Management**  
  Manage book details and availability. Admins can add, edit, and organize books, setting availability and updating information as needed.
- **Category Management**  
  Organize books into categories, enabling users to easily browse and read based on specific categories.
- **Book Rental**  
  Admins create books they are responsible for. Users can request to rent books, while admins have the authority to approve or reject these requests, with the option to specify a rejection reason.
- **Reading Recommendations**  
  Receive personalized book recommendations based on the categories you've read.
- **Book Reviews and Comments**  
  After returning a book, users can leave reviews, add comments, and reply to other users' recursively.
- **Filtering, Pagination, and Sorting**  
  Supports server-side filtering, pagination, and sorting via the *Specification API*, optimizing data retrieval and browsing performance.
- **User Roles and Permissions**  
  Role-based access control allows admins to manage users, categories, and permissions. Admins can create categories, add books, deactivate user accounts, and approve or reject book rental requests.
- **Notifications**  
  Users receive notifications for:
   - Book return reminders one day before the due date.
   - Daily overdue reminders after the return date has passed.
   - Notifications to both the renter and owner upon rental confirmation.
   - Email notifications with rejection reasons if a rental request is denied.
- **Monitoring**  
  Integration with Grafana for monitoring using pre-configured dashboards. Log collection is managed via Loki and Prometheus, providing efficient visualization and tracking.
- **Reporting**  
  Generate PDF reports on rented books. Admins can access users' reports to apply penalties if they miss the return due date.
- **ChatBot**  
  A Chat Widget using the RAG Architecture. The chatbot includes predefined answers and allows admins to add custom responses dynamically.
- **Link Utils**  
  Admins can create and edit utility links to redirect users to internal pages or external sites, which will open in a new window.
## Technologies

- **Backend**: Spring Boot 3, Java 21
- **Authentication**: Google Login, GitHub Login
- **Frontend**: React JS, Tailwind CSS, SCSS, Material UI
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

2. **Start the services** using Docker Compose:
    ```bash
    docker-compose up
    ```

3. **Start the back-end**:
    ```bash
    ./mvnw spring-boot:run
    ```

4. **Start the front-end**:
    ```bash
    cd frontEnd
    npm i
    cd src
    npm run start
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