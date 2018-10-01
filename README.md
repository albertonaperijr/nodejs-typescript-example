# NodeJS TypeScript Example

## Local Setup

To run the API locally:

1. Install [`yarn`](https://yarnpkg.com/en/docs/install).

2. Setup the database configuration.

- This is the default database configuration using MySQL as database:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=nodejs
MYSQL_USERNAME=root
MYSQL_PASSWORD=
```

- You can change the configuration in `.env` file.

- Please make sure that you have a clean database before running the project. This project is using [TypeORM](https://github.com/typeorm/typeorm) to automatically create the tables and populate it with our test data. The test data is in the **test -> db** folder.

3. Run `yarn install` after cloning this repository. The project provides the following scripts:

- `yarn start` will start the server in development mode. It uses **nodemon** to watch for changes and restart the server.
  It will run **tslint** over the source files after every restart, but errors will not stop the server from running.
  TypeScript files are compiled on-the-fly using **ts-node**.

- `yarn test` will run unit test using **mocha**.



## Main Libraries

- [Express](http://expressjs.com/) - Web framework
- [routing-controllers](https://github.com/typestack/routing-controllers) - Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework.
- [TypeORM](https://github.com/typeorm/typeorm) - TypeScript ORM
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env for nodejs projects.



## Database Schema 
### user 

| column name | data type | details | 
| ----------- | --------- | ------- |
| pk_user_id | bigint | not null, primary key |
| first_name | string |  |
| last_name | string |  |
| photo | string |  |
| email | string | not null, indexed, unique |
| password | string |  |
| access_level | int | not null |
| status | int | not null |
| created_at | datetime | not null, timestamp |
| updated_at | datetime | not null, timestamp |

* access_level - Options: 1 = Teacher, 2 = Student
* status - Options: 1 = Active, 2 = Inactive, 3 = Blocked, 4 = Suspended Student

### student

| column name | data type | details | 
| ----------- | --------- | ------- |
| pk_student_id | bigint | not null, primary key |
| fk_teacher_user_id | bigint | not null, indexed, foreign key |
| fk_student_user_id | bigint | not null, indexed, foreign key |
| status | int | not null |
| created_at | datetime | not null, timestamp |
| updated_at | datetime | not null, timestamp |

* fk_teacher_user_id references user
* fk_student_user_id references user
* status - Options: 1 = Active, 2 = Inactive
