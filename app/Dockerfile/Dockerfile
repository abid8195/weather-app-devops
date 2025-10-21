# Serve static files via NGINX
FROM nginx:alpine

# Remove default nginx static content and copy all files from the build context
RUN rm -rf /usr/share/nginx/html/*

# When building from inside the `app/` folder use '.' as the build context
# This copies index.html, styles.css, script.js, assets, etc.
COPY . /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
