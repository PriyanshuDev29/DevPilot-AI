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









* **AuthService**
* 
* **│**
* 
* **├── UsersService**
* 
* **├── JwtService**
* 
* **└── bcrypt**





* **bcrypt → Securely hash passwords.**
* **@nestjs/jwt → Create and verify JWT tokens.**
* **passport + passport-jwt → We'll use these later to protect routes with JWT authentication.**
* **@nestjs/passport → NestJS integration with Passport.**





* ###### **So basically interface is used for services to avoid any conflict in receiving a request body. DTO is used to validate it in the controller.**
* ###### **DTO belongs to HTTP layer.**
* ###### **Interface belongs to Business layer.**









* #### **Access Token vs Refresh Token**



**Think of them as two different keys.**



##### **Access Token**



**\* Short-lived (15 minutes, 1 hour, etc.)**

**\* Sent with \*\*every protected request\*\***

**\* Used to access APIs**



**Example:**



**```http**

**GET /projects**

**Authorization: Bearer <access\_token>**

**```**



**---**



##### **Refresh Token**



**\* Long-lived (7 days, 30 days, 90 days...)**

**\* \*\*Never\*\* sent with every request**

**\* Used \*\*only\*\* to obtain a new access token**



**Example:**



**```http**

**POST /auth/refresh**

**```**



**Body or Cookie:**



**```json**

**{**

&#x20;   **"refreshToken": "..."**

**}**

**```**



**Server returns:**



**```json**

**{**

&#x20;   **"accessToken": "new\_access\_token"**

**}**

**```**



**---**



##### **Complete Flow**



**### Login**



**```text**

**Email + Password**

&#x20;       **│**

&#x20;       **▼**

**Server verifies credentials**

&#x20;       **│**

&#x20;       **▼**

**Returns:**

&#x20;   **Access Token (1 hour)**

&#x20;   **Refresh Token (30 days)**

**```**



**---**



**### First Hour**



**Every request:**



**```text**

**GET /projects**



**↓**



**Access Token**



**↓**



**Verified**



**↓**



**Success**

**```**



**---**



**### After One Hour**



**The access token expires.**



**Instead of showing:**



**```**

**Please login again**

**```**



**the frontend silently does:**



**```text**

**POST /auth/refresh**



**↓**



**Refresh Token**



**↓**



**Verified**



**↓**



**New Access Token**

**```**



**The user doesn't even notice.**



**---**



**### After 30 Days**



**Now the refresh token also expires.**



**```text**

**POST /auth/refresh**



**↓**



**Refresh Token expired**



**↓**



**401 Unauthorized**



**↓**



**Redirect to Login**

**```**



**Now the user enters credentials again.**



**---**

##### 

##### **Why not make the Access Token valid for 30 days?**



**This is an interview favorite.**



**Suppose someone steals your access token.**



**If it expires in:**



**### 1 hour**



**The attacker can use it for at most one hour.**



**---**



**### 30 days**



**The attacker has access to your account for a month.**



**That's why access tokens are intentionally short-lived.**





#### **Why not use only Refresh Tokens?**



**Because refresh tokens are much more sensitive.**



**Imagine every request looked like:**



**```text**

**GET /projects**



**↓**



**Refresh Token**

**```**



**If someone steals that refresh token, they can keep generating new access tokens for days or weeks.**



**That's why refresh tokens are used \*\*only\*\* on the refresh endpoint.**







#### **Where are they stored?**



**This is another important design decision.**



**## Access Token**



**Could be stored in memory or an HttpOnly cookie, depending on your authentication strategy.**



**---**



**## Refresh Token**



**Typically stored in a \*\*secure HttpOnly cookie\*\*.**



**Why?**



**Because JavaScript can't access an HttpOnly cookie, which reduces the risk from XSS attacks.**







**# One More Thing**



**Suppose the user clicks \*\*Logout\*\* after 5 minutes.**



**The refresh token still has \*\*29 days\*\* remaining.**



**Should the user still be able to refresh the session?**



**\*\*No.\*\***



**So what do we do?**



**We \*\*invalidate\*\* the refresh token.**





**That's one reason many applications store refresh tokens in the database (or keep a blacklist), while access tokens are usually stateless.**







#### **Stateless vs Stateful Authentication**



**This is something interviewers love asking.**



* ##### **Access Token (Stateless)**



**The server doesn't need to store it.**



**It only verifies the signature.**



**No database lookup is required just to validate the token.**







* ##### **Refresh Token (Stateful)**



**The server often checks:**



**\* Does this refresh token exist?**

**\* Has it been revoked?**

**\* Has the user logged out?**

**\* Has it expired?**



**That typically involves server-side state.**









* **JwtModule.registerAsync({...})**



**Many beginners think this "enables JWT authentication."**

**It doesn't.**

**It only configures a service that can:**

1. **sign tokens**
2. **verify tokens**



**It does not:**

1. **protect routes**
2. **read Authorization headers**
3. **authenticate users**



**Those responsibilities belong to Passport and the JWT strategy,**





* **A JWT is signed, not encrypted.**







* **Passport is simply an authentication framework.**

**It doesn't know anything about:**

1. **JWT**
2. **Google Login**
3. **GitHub Login**
4. **Username/Password**



**It only knows one concept:**

**"Authentication is done using a strategy."**



**Think of Passport as a manager.**



**The manager doesn't authenticate anyone.**

**Instead, it asks one of its employees.**





* **A strategy is the algorithm used to authenticate a request.**



* **Passport**
* 
* **│**
* 
* **├── Local Strategy**
* **│      (email/password)**
* 
* **├── JWT Strategy**
* **│      (Bearer Token)**
* 
* **├── Google Strategy**
* **│      (Google OAuth)**
* 
* **├── GitHub Strategy**
* **│      (GitHub OAuth)**
* 
* **└── Facebook Strategy**







* **JwtStrategy**



**Its responsibility is:**

**"Given a JWT, authenticate it."**



**It knows:**



1. **How to extract the token**
2. **How to verify the signature**
3. **How to decode it**
4. **How to fetch the user**



**It doesn't decide whether a particular route requires authentication.**





* **JwtAuthGuard**



**Its responsibility is:**



**"Should this request be authenticated before entering the controller?"**



**The guard doesn't know how JWT authentication works.**



**It simply delegates to Passport.**







* ### **The logout problem**



**Suppose:**



**10:00**



**JWT issued**



**↓**



**Valid until 11:00**



**At 10:15:**



**User clicks Logout**



**Can the server "delete" that JWT?**



**No.**

**Because the JWT isn't stored anywhere.**

**It's just a signed string.**

**The server has nothing to delete.**

**This is the consequence of stateless authentication.**





* ### **Solution ---> Refresh Token Revocation (Most common in production)**



**This is what many large systems do.**



**Remember our earlier discussion:**



**Access Token**

**↓**



**15 minutes**

**Refresh Token**

**↓**



**30 days**



**On logout:**



**Delete Refresh Token from database**



**Now:**



**The current access token may still work until it expires.**

**After 15 minutes, it expires.**

**Since the refresh token has been revoked, the client cannot obtain a new access token.**

**The user is effectively logged out.**



**This gives a good balance between performance and security.**

