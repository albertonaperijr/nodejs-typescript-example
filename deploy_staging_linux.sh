#!/bin/bash
#===============================================================================
#
#       SERVER DEPLOYMENT
#
#		@author: Alberto Naperi Jr.
#
#===============================================================================

echo -e ""
echo -e "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *"
echo -e "*                                                               *"
echo -e "* SCRIPT INFO: Deploying staging nodejs-assessment.             *"
echo -e "*                                                               *"
echo -e "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\n"

# Remove files/folder
echo "Removing old files..."
rm -rf Dockerfile
rm -rf node_modules


# Copy files
echo "Copying new files..."
cp -r .env-staging .env
cp -r dockerfile-staging Dockerfile


# Run docker
docker rm -f nodejs-assessment
docker rmi nodejs-assessment
docker build -t nodejs-assessment .
docker run \
    --name nodejs-assessment \
    --restart=always \
    -p 9001:9001 \
    -v /opt/.pm2/nodejs-assessment:/opt/.pm2/nodejs-assessment \
    -v /etc/timezone:/etc/timezone \
    -v /etc/localtime:/etc/localtime \
    -d \
    nodejs-assessment


# End