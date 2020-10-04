# Discord GumBot

Provides useful commands for Gumballs and Dungeons such as:
- Current time
- Reset time
- Links to Wiki 
- Links to Forum
- Flip a coin
- Roll a dice
- Create a simple yes/no poll

Finally, it also scrapes the Gumballs and Dungeons Facebook page for Spy codes and sends new codes to a specified Discord channel.

## Installation

### Node.js

The application can be run locally with the following:

    cp .env{.example,}
    node .

### Docker

The application can be run in a docker container with the following:

    cp .env{.example,}
    docker build -t bradcornford/discord-gumbot .
    docker run -d bradcornford/discord-gumbot

### Docker-Compose

The application can be run using docker-compose container with the following:

    cp .env{.example,}
    docker-compose build
    docker-compose up -d
