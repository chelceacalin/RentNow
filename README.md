# Rent Now

Rent Now facilitates book rentals within a company, allowing you to manage and share your book collection with colleagues.

## Features

- **Book Management**: Add, edit, and manage the availability of books.
- **Category Management**: Group books into categories to easily browse and read books based on specific categories.
- **Book Rental**: Rent and return books, and view your rented book list.
- **Reading Recommendations**: Receive book recommendations based on the categories you've read.
- **Book Reviews and Comments**: Review books, add comments, and reply to other users' comments.
- **Filtering, Pagination, and Sorting**: Uses *Specification API* to enable server-side filtering, sorting, and pagination.
- **User Roles and Permissions**: Admins can create categories, manage users and their activity, and control other users' permissions. Regular users have limited access.
- **Notifications**: Users receive reminders one day before a book needs to be returned and daily after the return date is exceeded. Both the renter and the owner of the book are notified when a book is rented.
- **Monitoring**: The app integrates with Grafana for monitoring, using pre-configured dashboards for visualization, and Loki for log collection.

## Additional Features ✨

- Request filter on the back-end and interceptor on the front-end.

## Technologies

- **Backend**: Spring Boot.
- **Authentication**: Google Login, GitHub Login.
- **Frontend**: React JS, Tailwind CSS, SCSS, Material UI.
- **Database Migrations**: Flyway.
- **Image Storage**: Minio.
- **Monitoring**: Loki (logs), Prometheus (metrics).
- **Dashboards**: Grafana.
- **Email Service**: Gmail SMTP.

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
- **Minio Server**: [http://localhost:9090](http://localhost:9090)
- **Minio Console**: [http://localhost:9091](http://localhost:9091)
- **Server Health**: [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
- **Grafana**: [http://localhost:3000](http://localhost:3000) (default credentials: admin/admin)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)

### Documentation

- **JSON API Documentation**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **UI Interface API Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Actuator**: [http://localhost:8081/actuator](http://localhost:8081/actuator)

### To-Do List

```plaintext
     => Integrate Chat GPT API, feed it database data, and generate book recommendations
     => Integrate Superset for additional analytics
