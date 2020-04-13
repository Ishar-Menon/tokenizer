FROM ubuntu:18.04

RUN apt update && \
    apt install -y python3 && \
    apt-get install -y python3-pip && \
    pip3 install Flask==1.0.2 Flask-Cors==3.0.7 Flask-JWT-Simple==0.0.3 pymongo PyJWT bcrypt

WORKDIR /app

COPY . /app

EXPOSE 5000

CMD ["python3","app.py"]