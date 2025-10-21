# Serve static files via NGINX
FROM nginx:alpine

# Remove default nginx static content and copy site from the `app/` folder
RUN rm -rf /usr/share/nginx/html/*

# Copy the entire `app/` directory into nginx html directory. This allows
# building the image from the repository root (docker build -t weather-app .)
COPY app/ /usr/share/nginx/html/

# Expose HTTP
EXPOSE 80

# Keep nginx running in foreground
CMD ["nginx", "-g", "daemon off;"]
