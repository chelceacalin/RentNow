# Rent Now

Rent Now facilitates book rentals within a company. Manage and share your book collection easily with colleagues.

## Features

- **Book Management**: Add, update books, along with images, and delete books.
- **Category Management**: Group books into categories
- **Book Rental**: Rent and return books, view your rented book list.
- **Filtration, Pagination, Sorting**: Used *Specification API* to ensure server side filtration, sorting and pagination
- **User Roles & Permissions**: Admins have the ability to create categories also manage users, normal users can't.

## ✨

- Debouncing On Inputs
- Request filter on back-end and interceptor on front-end

## Technologies

- **Backend**: Spring Boot.
- **Authentication**: Google login, Github login.
- **Frontend**: React Js, Tailwind CSS, SCSS, Material UI.
- **Database Migrations**: Flyway.
- **Image Storage**: Minio.
- **Logging**: Loki - Logs, Prometheus - Metrics
- **Dashboards**: Grafana

## Getting Started

### Prerequisites

- Java 21
- Docker and Docker Compose

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
[BE] => Spring Aop - Logging
     => Liveness and Readyness Checks
     => Argo CD
     => Nginx
     => CI pipeline
     => Replication, 2 pods, follower leader strategy
     => Caching, Etags, Cron Jobs
     => Notifications when book is returned
     => Deploy it, ingress
     => Jmeter
     => Book Review, reply to comments
     => Chat Gpt Api, feed it db data and make it recommend books
     => Superset, OpenSearch
     => In pagina principala sa am un filtru in care sa caute tot si button sa afisez filtrul avansat

</pre>
