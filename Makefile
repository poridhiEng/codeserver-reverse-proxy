tag:=v1.1
env:=python

build:
	@ docker build --platform linux/amd64 -t poridhi/codeserver-${env}:${tag} -f Dockerfile.python .

run:
	@ docker run --name codeserver-${env} -p 8080:8080 poridhi/codeserver-${env}:${tag}

clean:
	@ docker stop codeserver-${env}
	@ docker rm codeserver-${env}