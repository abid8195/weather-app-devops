# weather-app-devops

This repository contains a simple static Weather App and Docker + CI configuration
to build and smoke-test the site in GitHub Actions.

Local Docker build and run
--------------------------

1. Ensure Docker Desktop (or Docker Engine) is running on your machine.
2. From the repository root run:

	docker build -t weather-app:local .

3. Run the container and open http://localhost:8080:

	docker run -d --name weather-app -p 8080:80 weather-app:local

4. Stop and remove when done:

	docker rm -f weather-app

Notes about CI
--------------

There are two GitHub Actions workflows under `.github/workflows/ci.yml`.
They perform basic checks (file presence and https icon URLs), build a Docker image
on the runner, and run a quick smoke test by curling the site. The workflow does
not push images to a registry. To enable pushing set up appropriate secrets and
add a push step to the workflow.

Local build failed on this machine because the Docker daemon was not accessible.
If you see similar errors, start Docker Desktop or ensure the Docker service is
available to your shell (on Windows, enabling WSL2 backend is recommended).
