# The Gadget Vault
![TheGadgetVault](https://user-images.githubusercontent.com/101066826/225198269-4c305354-1f5d-456b-8f5a-bf775c515684.gif)

### An e-commerce website built with the MERN stack that allows users to create an account, add items to their cart, and pay for those items.

## Tech used: ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
This readme will be divided into two parts: Frontend and backend

## Frontend
This React application utilizes the react-router-dom library to enable client-side routing. The routing is defined in the App.js file using the Switch and Route components, which map URLs to the corresponding page components. Each page component is imported from the pages folder and is rendered inside the Switch component. I will explain each of the components and page components

### Components folder
Each file in the “components” folder is used by a component in the “pages” folder. In short, Page components -> Components. These are the relationships that each page component has with each component:

* FeaturedProductsSection.js uses FeaturedProduct.js to display all featured products on the Home page component.
* OnSaleProduct.js uses OnSaleProductSlideshow.js and OnSaleMobile.js to display all onsale products on the Home page component
* Cart.js uses the CartItem.js component to display each item in the user's shopping cart.
* Category.js uses the CategoryProduct.js component to display products belonging to the selected category.
* The DefaultLayout component uses Navbar.js and Footer.js to provide navigation across the application. Search.js is also used by Navbar.js.
* The Orders page component uses the OrderProduct.js

### Pages folder
* Home.js fetches home page data from the backend API and renders Benefits Section.js, FeaturedProductsSection.js, HomeSlideshow.js, and OnSaleProductSlideshow.js with the data they need using props.

* About.js, Returns.js, and Privacy.js all just simply render sections that display some generic legal jargon

* Account.js sends an API request to check if the client is actually logged in or not. If they aren’t, the client is redirected to Login.js. Otherwise all the users’ details are displayed (username, email, address). Users can then modify their data by clicking on the edit buttons. When one of the edit buttons is clicked, it gets replaced by an input where the client can update whichever input they chose. After they’re done, the client can select the “Save changes” button to send the new account details to the backend so it can be updated. There is also a “logout” button that logs the client out of the account and a “order history” button that navigates the client to a route that shows all the orders they made.

* Cart.js sends an API request that gets the clients account details (including the cart array). The data is then stored into a state hook where the getTotal function will calculate the total of each object and handleCheckout redirects the client by sending a request to the backend which returns a Stripe url. Each cart item is also rendered into CartItem components. The information of each cart item is rendered into the props.

* Category.js is what’s rendered inside Apparel.js, Computer.js, Cooking.js, Onsale.js, Outdoor.js, Security.js, and Vehicle.js. It sends an API request that gets products in the category specified in the category props. (Eg. Cooking.js renders Category.js so the category prop will be “Cooking”)  When it receives this data, it stores it in the category’s redux using each respective category’s redux reducer. (Eg. When it receives data for Cooking.js, it stores that data using the updateCooking reducer)

* CreateAccount.js loads a form that allows the user to enter their username and password for their new account. When the user submits the information, a fetch request is made to the backend API. If the response fails, the validation tag gets populated with the error message. Otherwise the user is then navigated to the Login.js page

* Error.js simply loads an error page

* Login.js displays a form that allows the user to enter their username and password. When the user submits the information an API request is sent checking that login information. If the login is successful, the client is redirected to the Home.js page. Otherwise the error message will be displayed in a validation tag. 

* Orders.js sends an API request that returns the clients orders the data that gets returned is then converted into OrderProducts components. The information rendered in each component is the date the order was placed, an array of the users cart during that order and the shipping address. These components are then rendered and displayed

* Product.js makes an API request using the id of the product the user clicked. If the id is invalid the user is redirected to the Error page. The API response is stored in the productPageDetails state. If a user is logged in their information is also gathered using an API request and stored in the productPageDetails state. A section containing the product and the products pictures will be rendered. If the client is logged in, they will be able to see an “add to cart” button. The result of adding the item to the cart will be displayed (“Added to cart” or “Failed to add to cart”). They will also be able to see a button that allows them to write a review on the product. All the current reviews are generated with the Review.js component.

* DefaultLayout.js is the default layout that gets applied to all pages. It renders Navbar.js and the Footer.js on all pages.

### Redux
Redux is used to prevent multiple API calls for each product’s category. All the data that’s received from the request gets stored in each respective categorie's state. This removes the need of loading products for the user each time they leave and revisit the route. To see more information about Redux, see slices -> appInformation.js

## Backend
The backend has five important folders that I will briefly explain: config, middleware, models, routes, and security.

### Config
Config is a folder that contains db.js which is basically just used to make a connection to MongoDB. Almost all middleware use invoke the exported function from this file.

### Middleware
The Middleware folder contains all the exported middleware functions that handle requests made by clients. There’s 7 middleware files that each contain several functions that handle specific requests made by the users.

#### Account.js has 6 functions:
-createAccount extracts the username, password, and email values from the request body. If any of these fields are missing or empty, or there's already an account in the database with the same username value it throws an error. If both validations pass, a hashed password is generated using the bcryptMethods and inserted into the database using the Users model a 200 status code is then sent to the client indicating that the account creation was a success.
 
 -loginAccount extracts username and password in the request body. It then checks if both the fields are not empty and if there is a user record in the database with the requested username. If both these validations passed, it checks if the password for the user record is the same as the requested password using bcrypt. If the password is incorrect, it throws an error. Otherwise if the validation was successful, any previous sessions the user might have from the database is removed and a new one is generated and stored in the database using generateToken. It also creates a cookie with the session ID and gives it to the client. This cookie will now be used to authorize the client when they do something that needs authorizing. Finally, a 200 status code is sent indicating the login was successful.
 
 -logoutUser handles the logout of a user by removing the session from the database and clearing the session cookie from the client's browser. After that’s done it sends a 200 status code indicating the logout was successful.
 
-authorizeSession is used to authorize a user's session before proceeding to the next middleware it gets the session id from the request’s cookies and check if the session exists in the database. If the session doesn’t exist or is expired, a 401 code is sent to the client. Otherwise the next middleware is loaded

 -getAccount gets the session ID cookie from the request and uses that session ID to find the user it belongs to in the database using by comparing the username property with all the records in the users collection. If the user their data is sent (excluding password of course) back as a JSON response.
 
 -updateAccount gets the session ID cookie from the request object, as well as the new account data to be updated from the request body. It then cleans the data by converting all the string values to lowercase and checks if a new password was provided. If a new password is provided, it is hashed using bcrypt, and then the user's record in the database gets updated with the new account data. If successful a response with a 200 status code is sent.

#### Cart.js has 4 functions:
-deleteFromCart gets the ID of the product to be removed from the request’s body. The users session record from the database is retrieved using the findOne method on the Sessions collection. This is done to get the username associated with the session. Once the username is obtained updateOne is used to remove the item from the user's cart.

-updateQuantity extracts the sessionId and productId from the request body. First, the data is cleaned by replacing all special characters from the quantity field in the request body with an empty string using regex. The code then checks if newQuantity is not empty. updateQuantity then checks the database to find the user's cart, and checks if the product exists. If all the validations pass, it checks if the client is requesting a quantity less than one. If so, the code deletes the product from the user's cart. If the client is requesting a quantity greater than or equal to one, the code updates the object to the new quantity. If everything was successful, a 200 status code is sent to the client

-checkout first checks if the user's record exists and has an address. If the validation is passed, an array is created based off the users cart and sent to the Stripe API If everything was successful the Stripe session URL is sent to the client as a JSON response.

-checkoutSuccess handles a webhook from Stripe that indicates a sucessful payment was made by a user. It validates the signature retrieved from the header and constructs a webhook event object from the request body. If payment was successful, it goes to the database and inserts a new document to orders that contains the current date, the user’s current cart, and the users address. It then clears the user’s current cart from their user record.

#### Category.js has 2 functions that are almost identical:
-getCategory & getOnsale: retrieves products from the database that are onsale or are apart a specific category. It skips the number of rows specified by totalProducts and returns 12 products. A response  is returned containing the first 6 products found and a boolean value indicating whether there’s anymore products left after the first 6 products. This boolean is how I tell my frontend if there’s any more products left to load so it can remove the “Load more” button.
Home.js has 1 function called getHomeDisplay that gets all the featured and on sale products from the database and sends it as a JSON response
Orders.js has 1 function called getOrders that gets all the orders a user made by using their sessionRecord’s username and returns it as a JSON response

#### Product.js has 3 functions:
-getProduct: getProduct gets the productIdParameter from the request’s parameters. Then checks to see if it matches a valid ObjectId. It then uses the findById() method to find the product with the given productIdParameter and sends it to the client as a JSON response.

-addProductToCart: The session ID from the request cookies, and the product ID and product info from the request body is retrieved. It then finds the session documents in the database that contains the same session ID and retrieves the username from that session. It then finds the user record with that username.Then it checks if the requested product already exists in the user's cart. If the product exists in the cart, it sets a Boolean called productExists is set to true. Depending on the productExists boolean’s value it either increments the quantity of the cart item by 1 or adds a new cart item to the user's cart.

-writeReview: The form information and the product ID are extracted from the request, as well as the session ID from the cookies. It then retrieves the session record with the same session ID from the database. Then, the product record with the provided product ID is updated with the review using the request’s form information and username. A reviewId is also generated using a token.generateToken()

#### Search.js has 1 function: 
-searchProducts takes in search text from the requests and searches the database for products that match the search text using a regex pattern an array of products that match the search text is then sent as as a JSON response.

## Models folder
The models folder all export a Model object that allows the user to query to their respective Collection. (users, products, sessions, orders). Each model also has a schema object.

#### (Extra details about the database)
The database I decided to use is MongoDB. In the database I have four collections:
* Users: There are six properties in the users collection; id (ObjectId), username (String), email (String), password (String), address (String), and cart (Array of objects).
* Products: There are eleven properties in the products collection; id (ObjectId), title (String), description (String), price(Number), reviews (Number), productImages (Array of strings), category (String), credit (String), featured (Boolean), onsale (Boolean), priceId (String)
* Sessions: There are four properties in the sessions collection; id (ObjectId), username (String), sessionId (String), expireDate (Date)
* Orders: There are five properties in the orders collection; id (ObjectId), cart (Array of objects), username (String), created (Date), address (String)

## Routes folder
The routes folder contain files that export all the possible routes that can be made to the API.


## Security folder
This folder basically holds all the functions I need for convenience. 
* Bcrypt.js holds functions that hash a password (using bcrypt) and also contains functions that check and compare a hashed password against a plaintext password. * * Token.js contains a function that generates an id that will be used to create sessions. removeToken removes a token from a specific user in the database. 

## Potential optimizations
* When looking back at my code, there are times where I feel like I could have increased the readability of the code using the single responsibility principle. For example, on the frontend my Navbar component renders JSX for both the "Computer" layout and the "Mobile" layout. The only way for someone to tell which functions belong to which layout is the comment headers. If I were to do this again I would probably create a regular Navbar component and then create a seperate component called NavbarMobile. Another example of this on the backend is the validations in the middleware functions. I could have reduced the size of the function if I had just created a module that export functions that only do validations
* Another potential flaw I noticed on the backend is in functions like "getAccount" and "updateAccount". On both of these functions the clients session Id is retrieved from the cookies. The value of the sessionId is then used to search the users collection to find the account details about that user. This means for everytime these middleware functions are invoked, 2 querys are made to the database which is probably not good for performance. An easy solution to this is to just include unsensitive user data on the session. I already did that with the username so why not the email and address?

## Lessons Learned:
* On the Bug Tracker (my last project) I promised that I would use Redux on the next project I made. I used redux on The Gadget Vault to store already loaded products for each cateogry that user visits so that another API request wouldn't have to be made if the user revisits that category route. For example, if you go to the "/security" route, an API request gets sent to the backend requesting products in the security category. When the data is returned, it's stored in the applications state. (In this scenario it's pushed to the security state array). That data will then be loaded when the user revisits that route. If you recreate this scenario you will notice that the products load a lot faster because of this system. I'm definetly going to be looking for more ways to use Redux to improve loading times in the future.

* I also am greatful for the opportunity to feel the differences between using a NoSQL database like MongoDB and a relational database like PostgreSQL. In my opinion so far, I feel like MongoDB is more "easier" to work with because it feels like you're just dealing with simple JavaScript objects. Having all that said, I feel like PostgreSQL is or relational database generally is still the way to go if you have a large complex application because I feel like you need that strictness when dealing with data longterm.

* In The Gadget Vault usesed database backed sessions because I wanted to compare the differences between handling authenication and authorizing with JWT tokens vs databased backed sessions. In my opinion I feel like JWT tokens are good for performance but not as flexible as a database backed session. For example, let's say I wanted to "disable" a JWT token after the user logs out. Since I cannot outright disable the token, I would probably have to create a collection that stores blacklisted tokens. With database backed sessions I could just simply delete the session from the database.

* With The Gadget Vault I really wanted to solve a problem that had been bothering me on the Bug Tracker. The problem the Bug Tracker had was browsers that block third party cookies basically made the Bug Tracker useless because the backend and frontend are on seperate domains.

* Another thing I felt like I neglected on the Bug Tracker was the error handling. On the Bug Tracker, I tend to just send 500 error codes if something fails. In The Gadget Vault I wanted to be a little more descriptive with my error handling. For example, if the backend fails to authorize the user, a 401 code is sent instead of just sending 500. This simple act alone probably saved me a lot of time because I would just immediatly know where the source of the problem was when I was debugging my code. Going forward I'm definetly going to take error handling seriously.
