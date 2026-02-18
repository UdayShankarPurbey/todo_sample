FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG API_URL
# ENV API_URL=$API_URL

# # Replace placeholder in environment.ts
# RUN sed -i "s|__API_URL__|${API_URL}|g" src/environments/environment.ts
# RUN sed -i "s|__API_URL__|${API_URL}|g" src/environments/environment.development.ts

RUN npm run build -- --configuration production

# RUN npm run build

EXPOSE 4201

CMD ["npm" , "run","dev"]
