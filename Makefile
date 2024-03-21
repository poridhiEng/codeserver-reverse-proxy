tag := v1.2
env := python
repo := poridhi

build:
	@ echo "Building Docker image for repository ${repo}, environment ${env}, tag ${tag}..."
	@ docker build --platform linux/amd64 -t ${repo}/codeserver-${env}:${tag} -f Dockerfile.python .

run:
	@ echo "Starting Docker container for repository ${repo}, environment ${env}..."
	@ docker run --name codeserver-${env} -p 8080:8080 ${repo}/codeserver-${env}:${tag}

clean:
	@ echo "Stopping and removing Docker container for repository ${repo}, environment ${env}..."
	@ docker stop codeserver-${env}
	@ docker rm codeserver-${env}

push:
	@ echo "Pushing Docker image for repository ${repo}, environment ${env}, tag ${tag} to the registry..."
	@ docker push ${repo}/codeserver-${env}:${tag}
	@ echo "Image ${repo}/codeserver-${env}:${tag} successfully pushed to the registry."
