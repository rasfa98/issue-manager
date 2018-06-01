# Examination 3

## What is the address to your application?

## https://rasfa98.tk

## Describe what you have done to make your application secure, both in code and when configuring your application server

To make my application secure in code I have installed *helmet.js* and activated the *CSP* feature. This enables the Content Security Policy headers and some additional protection. I'm also verifying that the **POST** requests comes from GitHub by adding a middleware to the **POST** route. This middleware generates a *sha1* hash and compares it to the one from GitHub. To minimize leak of information I only send the required information to the client when rendering/editing/closing issues. Another thing that I do to prevent this is to send back a **404** if the **POST** request doesn't come from GitHub.

To make my application secure when configuring my server I have added a basic firewall which only makes it possible to connect to the server through the ports **80**, **443** and **22**. I have also created an account so I'm not using the **@root** user when configuring/changing my server-settings. I've configured my reversed proxy so it redirects all the requests through HTTP to HTTPS.

## Describe the following parts, how you are using them and what their purpose is

**Reversed proxy**

A reversed proxy is a server that forwards the requests from the client to the correct server. The benefits of using a reversed proxy is that information about the server is not visible from the outside and you can choose which connections that are allowed. It's also easier to scale your application since you can add more servers at any time. You can also speed up the response to the clients by configuring the proxy to use compression and caching. I'm using my proxy to serve static files from my public folder and to redirect all requests through HTTP to HTTPS.

**Process manager**

A process manager is a "container" in which your application is running during production. It provides many features such as monitoring of your application and logs. The main reasons for using a process manager is that it can restart your application if it crashes and it will start your application in production-mode, which disables some features and make it run faster. I'm using the process manager as described above.

**TLS certificates**

A TLS certificate is what allows you to have HTTPS connection to your server which makes it possible to encrypt the data that's being sent between the client and the server. I have fixed my own certificate by using the service *Let's Encrypt* and their *Cerbot Client* which I installed on my server.

**Environment variables**

Enviornment variables are variables that are linked to the envivornment in which a process runs. You can have different variables if you are in production/development and use it to store information that will be used in the application. You can also use them to configure your application depending on the enviornment. I'm using enviornment variables to store information that is used in my application and that I don't wan't to push to my repository, such as the webhook secret and the personal access token. 

## What differs in your application when running it in development from running it in production?

The only differences in my application when running it in production is that it runs in production mode and the URL's for the webhook and websocket are changed. I'm also using HTTPS which I didn't do when developing the application.

## Which extra modules did you use in the assignment? Motivate the use of them and how you have make sure that they are secure enough for production

All the modules have been checked for vulnerabilities using another globaly installed module called *NSP* which checks all the modules for defects/known vulnerabilities, all used modules have passed this test. Some of the modules that I have used such as body-parser, express, express-handlebars are not mentioned below. This is because they are modules that have been tested and used for a very long time, which makes them secure and reliable for production.

**dotenv**

Let's me put all my enviornment variables in a specific file which will then be loaded using the *dotenv* module. This is good since I can have structure and control over my variables and change/add them in an easy way. The latest build of this module is passing and it has over 4 million downloads in the last month, the module don't have any dependencies.

**helmet**

This module adds security to my application by setting various HTTP headers, all it's dependencies are up to date and the latest build is passing.

**octonode**

Helps me with the API requests to GitHub which makes it easy to **GET/EDIT** issues. This module has many contributors on GitHub and over 60 releases.

**secure-compare**

This is a module that is used to compare the **POST** request hash in a secure way when verifying the webhook payloads. This module don't have any dependencies and it has a large number of downloads.

**socket-io**

This is a module used to achieve real-time web functionality in my application. It's a very popular module which is used frequently. It has over 100 contributors/releases on GitHub and 7 million downloads per month which makes it reliable to use.

## Have you implemented any extra features?

**Extra client functionality**

I have added the abillity to close/reopen issues using the client. If a issue is closed the button changes from *close* to *reopen* and if it's closed and the page is refreshed, it's removed.

**Notifications**

When issues are closed/opened/reopened or edited the user get's a notification that's added to a list. Same thing happens if you add/remove/edit a comment on an issue. If you comment on an issue the body of the comment will be displayed in the notification as well.

**Using own certificate**

I have fixed my own TLS certificate through the service *Let's Encrypt*.
