# AnswerWritingMitra - AI-Powered Answer Evaluator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbhishekAnand2023%2FAnswerWritingMitra)

Your personal AI guide for mastering answer writing. Get expert-level feedback on your answers for UPSC, State PCS, CAPF, and other competitive exams. AnswerWritingMitra analyzes your structure, content, and clarity, providing actionable insights to help you write better and score higher.

**[➡️ Visit the Live Application](https://answer-writing-mitra.vercel.app/)**

---

 
*(Note: Replace with an actual screenshot of the application)*

## ✨ Key Features

- **Expert AI Analysis**: Leverages Google's Gemini 2.5 Flash model for high-quality, nuanced feedback.
- **Custom-Tailored Evaluation**: Configure the evaluation based on Examination Type, Paper, Marks, and Word Limit.
- **Detailed, Rubric-Based Feedback**: Receive a score and constructive criticism on parameters like structural integrity, content depth, and alignment with the question's core demand.
- **Secure & Private**: Your answers and data are sent directly to the Google Gemini API via a secure backend proxy. No data is stored on our servers.
- **Real-Time Streaming**: Watch the AI's evaluation appear in real-time, word by word.
- **Responsive Design**: Fully usable on desktop, tablet, and mobile devices.

## ⚙️ How It Works

AnswerWritingMitra is built with a security-first approach. Instead of handling the powerful Google Gemini API key on the frontend (in the browser), it uses a secure backend proxy built with **Vercel Edge Functions**.

1.  **User Input**: You fill out the form with your exam details, question, and answer on the React-based frontend.
2.  **Secure API Request**: The frontend sends this data to a dedicated Vercel Edge Function at `/api/evaluate`.
3.  **Backend Proxy**: This serverless function securely attaches the `API_KEY` (which is stored as a private environment variable on Vercel, never exposed to the user) to your request.
4.  **Google Gemini API**: The edge function calls the Google Gemini API with the complete, structured prompt.
5.  **Streaming Response**: The Gemini API streams the evaluation back to the edge function, which in turn streams it directly back to your browser.

This ensures that the API key is never compromised and provides a seamless, secure experience for the end-user.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- **AI**: [Google Gemini API](https://ai.google.dev/)

## 🚀 Getting Started (For Developers)

Want to run this project locally or deploy your own version? Follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Vercel CLI](https://vercel.com/docs/cli)
- A **Google Gemini API Key**. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/answer-writing-mitra.git
    cd answer-writing-mitra
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    The application is designed to be run with the Vercel CLI, which simulates the cloud environment locally.
    - Create a file named `.env` in the root of the project.
    - Add your Google Gemini API key to this file:
      ```
      API_KEY=your_google_gemini_api_key_here
      ```
    The Vercel CLI will automatically load this variable when you run the local development server.

4.  **Run the local development server:**
    ```bash
    vercel dev
    ```
    This command starts the Vite frontend and the Vercel Edge Function emulator. Your application will be available at a local URL (usually `http://localhost:3000`).

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Connect your repository to a new project on Vercel. Vercel should automatically detect that you are using Vite and configure the build settings.
3.  **Crucial Step**: In your Vercel project's settings, go to **Settings > Environment Variables** and add your Google Gemini API key:
    - **Key**: `API_KEY`
    - **Value**: `your_google_gemini_api_key_here`
4.  Trigger a deploy. Vercel will automatically build the site and deploy the edge function from the `api` directory.

## 💖 Support & Contribution

If you find this tool useful, please consider supporting its development!

- **[☕ Buy Me a Coffee](https://www.buymeacoffee.com/abhishekanand)**

Contributions are welcome! Feel free to fork the repository, open issues, and submit pull requests.

## 📧 Contact

Created by **Abhishek Anand**.

- **Email**: [abhishekanand1official@gmail.com](mailto:abhishekanand1official@gmail.com) or [anandabhishek9879@gmail.com](mailto:anandabhishek9879@gmail.com)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
