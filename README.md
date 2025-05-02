
# Email Assistant Chatbot

This project is an **AI-powered email assistant chatbot** built using **Next.js**, **Axios**, **Tailwind CSS**, and **Langchain**. The chatbot can help you send emails just by chatting with it. It leverages the **Llama model** and **Group API** to process requests and send emails based on your commands.

# Live Demo
**URL:** https://ai-agent-langchain.onrender.com/
# Main Screen
![Image](https://github.com/user-attachments/assets/6470293a-014f-48b5-9cde-761b7ab205d0)

## Features

- **Send emails via chat**: Interact with the chatbot to compose and send emails.
- **AI-driven**: Utilizes Langchain to create an intelligent agent for managing email communication.
- **Clean UI**: Tailwind CSS is used for styling to ensure a smooth user experience.
- **Seamless email sending**: Axios is used to make API requests for sending emails.

## Tools and Technologies Used

- **Next.js**: A React framework for building the application.
- **Axios**: For making HTTP requests to send emails via the Group API.
- **Tailwind CSS**: A utility-first CSS framework for fast styling.
- **Llama Model**: For natural language processing and AI-driven responses.
- **Langchain**: Used for creating an AI agent that can understand and process email-related tasks.

## Setup and Installation

### Prerequisites

1. **Node.js** (v14 or later)
2. **NPM** or **Yarn** for package management
3. **API Keys** for email sending (Group API or your email provider)

### Installation Steps

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/email-assistant-chatbot.git
    ```

2. Navigate into the project directory:
    ```bash
    cd email-assistant-chatbot
    ```

3. Install dependencies:
    ```bash
    npm install
    # or if you use yarn
    yarn install
    ```

4. Set up your API keys:
    - Create a `.env.local` file in the root of your project.
    - Add your API credentials like so:
      ```bash
      EMAIL_API_KEY=your_email_api_key
      GROUP_API_KEY=your_group_api_key
      ```

5. Start the development server:
    ```bash
    npm run dev
    # or if you use yarn
    yarn dev
    ```

6. Navigate to `http://localhost:3000` to interact with the chatbot.

## How to Use

- Open the application in your browser.
- Chat with the assistant by typing your email content.
- The AI will process your input and prepare the email for sending.
- Once you're satisfied with the email, simply confirm, and the email will be sent to the desired recipient.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- **Langchain**: For providing a framework to build powerful AI agents.
- **Llama Model**: For natural language processing and intelligent interactions.
- **Group API**: For email sending functionality.

---

Feel free to open an issue or reach out if you encounter any problems!
