FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=Europe/Zagreb

RUN apt update && apt install openjdk-11-jre-headless libreoffice-common libreoffice-java-common libreoffice-writer libreoffice-calc wget -yq

RUN wget -q https://github.com/ngs-doo/TemplaterExamples/releases/download/v7.1.0/templater-server.jar

COPY templater.lic .

EXPOSE 7777

ENTRYPOINT ["java", "-jar", "templater-server.jar"]