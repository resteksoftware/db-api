FROM node:latest

# set working directory
# RUN mkdir /usr/src
WORKDIR /usr/src

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH=/usr/src/node_modules/.bin:$PATH \
    DB_PG_PASSWD=JessicasAmazingPasswords \
    RUSTYBEAR_USERID=gfd@dspch.us \
    RUSTYBEAR_PASSWD=joshuaTree5 \
    RUSTYBEAR_EMAIL_DOMAIN=mail.rustybear.com

# install and cache app dependencies
ADD package.json /usr/src/package.json
RUN npm install

ADD . .

# RUN mkdir /usr/src/dist

# start app
CMD ["npm", "start"]
