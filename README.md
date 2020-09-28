# Discord SpyBot

Scrapes the Gumballs and Dungeons Facebook page for Spy codes and sends new codes to a Discord channel.

## Installation

### Node.js

The application can be run locally with the following:

    cp .env{.example,}
    node .

### Docker

The application can be run in a docker container with the following:

    cp .env{.example,}
    docker build -t bradcornford/discord-spybot .
    docker run -d bradcornford/discord-spybot

### Docker-Compose

The application can be run using docker-compose container with the following:

    cp .env{.example,}
    docker-compose build
    docker-compose up -d
