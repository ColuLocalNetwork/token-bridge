FROM node:8

RUN mkdir /stuff
WORKDIR /stuff

COPY package.json .
COPY package-lock.json .

RUN git clone https://github.com/ColuLocalNetwork/poa-bridge-contracts.git

RUN mkdir submodules && \
  mv poa-bridge-contracts submodules && \
  cd submodules/poa-bridge-contracts

RUN npm install --unsafe-perm

RUN cd submodules/poa-bridge-contracts && \
  npm install && \
  ./node_modules/.bin/truffle compile && \
  cd deploy && \
  npm install

ADD . .


CMD ["npm", "start"]
