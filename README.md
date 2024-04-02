# codeserver-reverse-proxy

Brief description of what the project does.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Container](#container)

## Installation

To get started with this project, follow these steps:

1. Clone this repository to local machine using `git clone git@github.com:poridhiEng/codeserver-reverse-proxy.git`.
2. Navigate to the project directory: `cd codeserver-reverse-proxy`.
3. Switch the branch: `git checkout feature/node-reverser-proxy `,
4. Install project dependencies by running: `npm install`.
5. Run the server by running: `node index.js`.

## Usage

After installing dependencies, you can run the project locally by executing: 
`http://localhost:3000/anynamespace/?folder=app`.

But for now, before executing, make sure you have running docker container and accesible from `localhost:6060`.

## Container

Let's run a Docker container to create a server that will be proxied.

1.  Pull the Docker image to local machine using the following command: 
    ```bash
    docker pull poridhi/codeserver-python:v1.2
    ```
2. Once pulling the Docker image, we can run it locally using the following command:
    ```bash
    docker run --name codeserver-python -p 6060:8080 poridhi/codeserver-python:v1.2
    ```
