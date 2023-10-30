# Run & Test

```bash
# Intall dependencies
yarn install

# Run the test
yarn run test
```

# CI/CD (optional)

```
Write a short description of how would you deploy your solution in a cloud environment (AWS, Azure, GCP).
What type of resources would you use and why?
```

### Steps

I would use GitHub Actions, but there are almost infinite service for that like Gitlab CI/CD, Drone, CircleCI, and so on.
In the main code base there should be ESLint, Prettier, Husky, with a proper configuration, some version handling solution,\
different stages of the phases of the development: dev, beta, staging, prod, or something like this to avoid problems on production.

1. Run the tests
2. Check the code quality with ESLint, and fix the issues and prettify the code if necessary.
3. Deployment

### Details

Let's say I would like to deploy to AWS,\
and the environment would be a webshop admin panel where we can uploadt the images to products.

- The mainly used framework would be [SST](https://sst.dev/) to help me to manage AWS.\
  It makes easy to manage the permissions, rules, and everything.\
- An API with REST design (just to remain simple), implemented in Node.js to handle file uploads, which calls our FS class.\
  Also should be wrapped with an Auth layer and other security related solutions\
  depends on the use case how publicly accessible is our API.

There are several ways to make this work,\

- If We're very stricted to AWS than S3, SQS, and might API endpoints should take care of the work.\
  Quened execution can helps us to avoid issues related to the 'FileMapper' class job,\
  the very primitive approach which just writes a 'map.json' file repeatedly every time when we add or remove a file,
  but in other hand if we decide not to use that mapper we can leave quened way to execute.
- If We're not stricted to AWS I would suggest to use a very simple API in Node.js which handles everything we need,\
  and has full access to the file system inside of a Docker container or directly depends on the demands of the client.
