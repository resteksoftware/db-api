#!/bin/bash

# Remove all files in ersdispatch so we can cleanly inject new files from S3
# Note this particular rm invocation gets dot files as well
cd /home/ubuntu/gfddispatch
rm -rf * .[^.]*
mkdir -p /home/ubuntu/gfddispatch/dist

# Install and/or upgrade nginx
apt-get -y install nginx

# Replace the default nginx website config with a proxy to our node app
# Get this file from S3
# This should no longer be done while prod is behind a LB and dev is not
# because certbot is getting confused
# rm -f /etc/nginx/sites-available/default
# aws s3 cp s3://dispatchresponse/scripts/nginx-server.conf /etc/nginx/sites-available/default

# Get environment variables and inject into .env
aws s3 cp s3://dispatchresponse/scripts/environment-vars.txt /home/ubuntu/gfddispatch/.env

# Get AWS Amplify and Cognito credentials
aws s3 cp s3://dispatchresponse/scripts/aws-credentials.json /home/ubuntu/gfddispatch/.aws-credentials.json
aws s3 cp s3://dispatchresponse/scripts/aws-exports.js /home/ubuntu/gfddispatch/.aws-exports.js

# Get and install favicon
aws s3 cp s3://dispatchresponse/scripts/favicon.ico /home/ubuntu/gfddispatch/dist/favicon.ico

service nginx restart

# This creates a default home page although nginx redirects it away to our node app
echo 'hello world' > /var/www/html/index.html
hostname >> /var/www/html/index.html

# This updates node to version 10
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get -y install nodejs

# Ensure that a log file and directory exists for node processes that we create
# Useful when a new server is spun up and has no effect for existing servers
mkdir /var/log/node >/dev/null 2>&1
touch /var/log/node/console.log

# Ensure we have the system set to the correct timezone since AWS CodeDeploy
# deployments will default to UTC
timedatectl set-timezone America/New_York

exit 0
