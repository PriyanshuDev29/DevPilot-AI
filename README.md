## **Why use @nestjs/config?**



* Because we never want things like: const url = "mongodb+srv://..."
inside the code.
Everything configurable belongs in .env.







## **Flow**



Frontend



↓



POST /auth/register



↓



AuthController



↓



AuthService



↓



UsersService



↓



MongoDB



↓



JWT Generated



↓



Response





* AuthService doesn't talk to MongoDB directly. Instead it asks UsersService.
* Why?
* Because UsersService owns everything related to users.







## **Why decorators instead of plain JavaScript?**



* Because Nest uses decorators to generate metadata, making dependency injection and schema registration much cleaner.





* **In NestJS, a DTO (Data Transfer Object) is an object that defines the exact schema and shape of data sent over the network.**





### **Why register UserSchema in UsersModule instead of AppModule?**



* **Because feature modules should own their own models. It keeps the application modular and prevents AppModule from becoming a dumping ground for every schema.**





### **Why don't we install MongoDB manually?**



* Because containers should be reproducible.
* Anyone cloning your repo should get the exact same database.





* **React should never communicate directly with the database because it runs on the client's machine. The database is part of the server-side infrastructure and should only be accessed through the backend. The backend is responsible for authentication, authorization, validation, business logic, and interacting with the database. This prevents exposing database credentials and enforces a secure architecture.**





### **Inside Docker we won't use localhost, We'll use mongodb, Why?**



* **Because Docker creates an internal network where services can talk to each other using their service name.**





* **AppModule ---> Creates the database connection.**
* **UsersModule ---> Registers the User model on that connection.**



* **forRoot() creates a database connection. The application only needs one shared connection. Feature modules should use MongooseModule.forFeature() to register their own models on that existing connection. This avoids creating multiple unnecessary connections and keeps responsibilities separated.**





* **ConfigModule.forRoot({**
* &#x20;   **isGlobal: true,**
* **})**



#### **Why isGlobal?**

* **Without it, every module would have to import ConfigModule.**





### **With Validation Pipes**



**Request**



**↓**



**ValidationPipe**



**↓**



**Reads DTO decorators**



**↓**



**Checks email**



**↓**



**Checks password length**



**↓**



**If invalid → 400 Bad Request**



**↓**



**Otherwise Controller**



* **The controller is never reached if validation fails.**
* **ValidationPipe is absolutely needed if you want your DTO validation decorators to have any effect. Without it, they're just annotations that nothing uses.**

