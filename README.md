# ECE-Bot

ECE-Bot is a Discord bot designed to allow users to pick roles.

## Running with Docker

1. Clone this repository:

   ```bash
   git clone https://github.com/Yamboy1/ECE-Bot.git
   ```

2. Rename `.example.env` to `.env` file in the root directory of the project and update the values.

3. Rename `roles.example.json` to `roles.json` file in the root directory of the project and add in your own values.

4. Build the Docker image:

   ```bash
   docker build -t ece-bot .
   ```

5. Run the Docker container:

   ```bash
   docker run --env-file .env ece-bot
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

&copy; 2023 Yamboy1
