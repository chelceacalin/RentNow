# Rent Now

Rent Now facilitates book rentals within a company. Manage and share your book collection easily with colleagues.

## Features

- **Book Management**: Manage books, edit them, their availability etc.
- **Category Management**: Group books into categories so you can read books from only a certain category if you want
- **Book Rental**: Rent and return books, view your rented book list.
- **Filtration, Pagination, Sorting**: Used *Specification API* to ensure server side filtration, sorting and pagination
- **User Roles & Permissions**: Admins have the ability to create categories also manage users and their activity and have control over other user's permissions, normal users can't.
- **Notifications**: Users get reminders the day before needing to return a book, and every day after exceeding the return date. Also both the rented and the owner of the book get notified when someone rents a book
- **Monitoring**: The whole app is integrated with Grafana, using pre-imported dashboards for visualisations and Loki for log collection
## ✨
- Request filter on back-end and interceptor on front-end

## Technologies

- **Backend**: Spring Boot.
- **Authentication**: Google login, Github login.
- **Frontend**: React Js, Tailwind CSS, SCSS, Material UI.
- **Database Migrations**: Flyway.
- **Image Storage**: Minio.
- **Monitoring**: Loki - Logs, Prometheus - Metrics
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
   
3. **Start the back-end**
     ```bash
    ./mvnw spring-boot:run
    ```

4. **Start the front-end**
     ```bash
    cd frontEnd
    npm i
    cd src
    npm run start
    ```

### Access Points ( local )

- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **React Frontend**: [http://localhost:4173](http://localhost:4173)
- **Minio Server**: [http://localhost:9090](http://localhost:9090)
- **Minio Console**: [http://localhost:9091](http://localhost:9091)
- **Server Health**: [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
- **Grafana**: [http://localhost:3000](http://localhost:3000) -> admin : admin
- **Prometheus**:  [http://localhost:9090](http://localhost:9090)

### Documentation

- **JSON Api Documentation**: http://localhost:8080/api-docs
- **UI Inteface Api Documentation**: http://localhost:8080/swagger-ui/index.html
- **Actuator**: [http://localhost:8081/actuator](http://localhost:8081/actuator)


### To Do
<pre>
     => Book Reviews with comments and reply to comments
     => Chat Gpt Api, feed it db data and make it recommend books
     => Recommend books based on history
     => Superset
</pre>
