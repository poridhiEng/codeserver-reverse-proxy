from flask import Flask, request, jsonify, redirect  # Import necessary modules

app = Flask(__name__)  # Create a Flask application instance

# Define a mapping of namespaces to Docker container URLs
container_urls = {
    "ns1": "http://localhost:7080",
    "ns2": "http://localhost:8080"
}

@app.route("/", defaults={"path": ""})  # Define a route for the root path "/"
@app.route("/<path:path>")  # Define a route with a dynamic path
def proxy(path):
    namespace, _, rest = path.partition("/")  # Split the path into namespace and the rest

    # Check if the namespace exists in the mapping
    if namespace not in container_urls:
        return "Namespace Not Found", 404  # Return a "Namespace Not Found" response

    # Get the corresponding Docker container URL for the namespace
    docker_url = container_urls[namespace]

    # Construct the target URL by appending the remaining path
    target_url = f"{docker_url}/{rest}"

    return redirect(target_url)  # Redirect to the target URL

if __name__ == "__main__":  # Check if the script is being run directly
    app.run(port=3000)  # Run the Flask application on port 3000
