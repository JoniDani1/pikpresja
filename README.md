# Albanian Grammar Checker

A full-stack web application designed to be the first dedicated grammar and spelling checker for the Albanian language. This tool provides real-time corrections and suggestions, leveraging the power of the OpenAI API to deliver accurate results.

This project was built not only to solve a unique problem but also to serve as a professional portfolio piece demonstrating best practices in web development, including a full testing suite, code quality tooling, and a secure backend.

---

### Live Demo

*[Link to your live application (when deployed)]*

### Screenshot

![Application Screenshot](./docs/images/screenshot.png)

---

## Features

- **Real-time Correction:** Get instant grammar and spelling corrections for Albanian text.
- **Side-by-Side Comparison:** Clearly see the suggested changes highlighted next to your original text.
- **Detailed Suggestions:** View a list of specific corrections to understand the changes made.
- **Secure Backend:** The server is built with security in mind, including rate limiting to prevent abuse.
- **Professional Codebase:** The project includes a full test suite, linting, and code formatting to ensure high-quality, maintainable code.

---

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **API:** OpenAI API (gpt-3.5-turbo)
- **Testing:** Jest & Supertest
- **Code Quality:** ESLint & Prettier
- **Containerization:** Docker & Docker Compose

---

## Setup and Installation

### Option 1 — Running with Docker (Recommended)

The easiest way to run this project. No need to install Node.js or any dependencies manually.

1. **Clone the repository:**
```bash
    git clone https://github.com/JoniDani1/pikpresja.git
    cd pikpresja
```

2. **Create an environment file:**
```bash
    cp backend/.env.example backend/.env
```
    Open `backend/.env` and add your OpenAI API key:
    OPENAI_API_KEY=your_openai_api_key_here
PORT=5000


3. **Build and run with Docker:**
```bash
    docker compose up --build
```

4. **Open the application:**
    Navigate to `http://localhost:5000` in your browser.

To stop the application:
```bash
docker compose down
```

---

### Option 2 — Running Locally (Manual Setup)

1. **Clone the repository:**
```bash
    git clone https://github.com/JoniDani1/pikpresja.git
    cd pikpresja
```

2. **Navigate to the backend directory:**
```bash
    cd backend
```

3. **Install dependencies:**
```bash
    npm install
```

4. **Create an environment file:**
```bash
    cp .env.example .env
```
    Open `.env` and add your OpenAI API key:
    OPENAI_API_KEY=your_openai_api_key_here
PORT=5000


5. **Start the server:**
```bash
    npm start
```

6. **Open the application:**
    Navigate to `http://localhost:5000` in your browser.

---

## Running Tests

1. Navigate to the `backend` directory:
```bash
    cd backend
```

2. Run the test suite:
```bash
    npm test
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key (get one at platform.openai.com) |
| `PORT` | Port the server runs on (default: 5000) |