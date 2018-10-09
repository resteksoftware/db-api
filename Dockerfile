FROM node:latest

# set working directory
WORKDIR /usr/src

# install and cache app dependencies
ADD package.json /usr/src/package.json
RUN npm install --production

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH=/usr/src/node_modules/.bin:$PATH \
    DB_PG_PASSWD=JessicasAmazingPasswords \
    RUSTYBEAR_USERID=gfd@dspch.us \
    RUSTYBEAR_PASSWD=joshuaTree5 \
    RUSTYBEAR_EMAIL_DOMAIN=mail.rustybear.com \
    AWS_ACCESS_KEY_ID=AKIAJY5VLHVOWYF5XEZQ \
    AWS_SECRET_ACCESS_KEY=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 \
    AWS_REGION=us-east-1 \
    GAPI_KEY=AIzaSyBih4RSzJ7R3g6cApTvkYMS7pDB8BHVWoA \
    NODE_ENV=production

ADD . .

EXPOSE 8080

CMD ["npm", "start"]
