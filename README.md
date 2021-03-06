# Discord GumBot

Provides useful commands for Gumballs and Dungeons Discord servers, such as:

- 8 Ball
- Accelerator calculator
- Announcements
- Cat pictures 
- Chaos date time
- Flip a coin
- Roll a dice
- Create a countdown
- Chaos giant create reset datetime
- Dad jokes
- Dog pictures
- Link to forum
- Create an invitation
- Create a simple yes/no poll
- Create a reminder
- Game reset time
- Rock, paper, scissors
- Stats
- Current time accors the globe
- Link to wiki

Finally, it also scrapes the Gumballs and Dungeons Facebook page for Spy codes and update announcements, sending them to a specified Discord channel.

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

### Environment Variables

- DISCORD_TOKEN  - Discord API token
- DISCORD_WELCOME_CHANNEL - The channel welcome announcements should be posted to. Can be false to DM the user instead
- DISCORD_WELCOME_MESSAGE - The welcome message to a new joiners
- DISCORD_README_CHANNEL - The readme channel
- DISCORD_DEFAULT_ROLE - The default role for new joiners
- DISCORD_CODES_CHANNEL - The channel code announcements should be posted to
- DISCORD_UPDATES_CHANNEL - The channel update announcements should be posted to
- POLL_INTERVAL - The interval for checking Facebook for updates
- BOT_PREFIX - The prefix the bot should respond to

### Example Docker Composer

    gumbot:
        image: bradcornford/discord-gumbot:latest
        container_name: gumbot
        environment:
            - TZ=Europe/London
            - POLL_INTERVAL=15m
            - DISCORD_TOKEN=XXX
            - DISCORD_WELCOME_CHANNEL=welcome
            - DISCORD_WELCOME_MESSAGE="Hello %USER%, and welcome to the %GUILD% server.\nYou've been assigned the %ROLE% role.\nPlease be sure to check the %README%."
            - DISCORD_DEFAULT_ROLE=guest
            - DISCORD_CODES_CHANNEL=general
            - DISCORD_UPDATES_CHANNEL=general
            - DISCORD_README_CHANNEL=readme
            - BOT_PREFIX=!
        logging:
            driver: "json-file"
            options:
                max-size: "50m"
        restart: unless-stopped
