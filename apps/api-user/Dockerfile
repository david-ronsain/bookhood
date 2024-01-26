FROM node:21-slim as prod
ADD . /app
WORKDIR /app
RUN apt-get update && apt-get install -y sudo && sudo npm install -g pnpm nx && sudo pnpm i -P
CMD ["sudo", "nx", "run", "api-user:serve:production"]

FROM node:21-slim as dev
ADD . /app
WORKDIR /app
RUN apt-get update && apt-get install -y sudo && sudo npm install -g pnpm nx && sudo pnpm i
CMD ["sudo", "nx", "run", "api-user:serve:development"]