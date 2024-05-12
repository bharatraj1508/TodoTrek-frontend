FROM node:latest
WORKDIR /app/todotrek-frontend
COPY . /app/todotrek-frontend
RUN npm install
RUN npm install -g @angular/cli
RUN npm install -g npm@latest
EXPOSE 4200
CMD ["npm", "run", "start"]