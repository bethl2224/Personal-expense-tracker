FROM postgres:latest

ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB expense

COPY schema.sql /docker-entrypoint-initdb.d/