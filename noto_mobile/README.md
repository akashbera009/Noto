# 📱 Noto Mobile

The official mobile application for **Noto**, built with React Native and TypeScript. It provides a clean, intuitive interface for managing your notes and interacting with AI-powered insights on the go.

## ✨ Features

- **Sync with Backend**: Real-time synchronization with the Noto FastAPI server.
- **AI Integration**: Request summaries and explanations directly from your mobile device.
- **Rich Text Support**: Create and edit notes with ease.
- **Native Performance**: Optimized for both Android and iOS platforms.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)

### Installation

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **iOS Specific (macOS only)**:
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

### Running the App

1. **Start the Metro Server**:
   ```bash
   yarn start
   ```

2. **Launch on Device/Emulator**:
   - **Android**: `yarn android`
   - **iOS**: `yarn ios`

## 🛠️ Development

- **Architecture**: Functional components with Hooks.
- **Styling**: Native styling with TypeScript support.
- **Networking**: Axios for API communication.

## 📝 Configuration

Ensure your `.env` (or config file) points to the correct backend API URL:
```text
API_URL=http://your-server-ip:8000
```

---

*Part of the [Noto Project](../README.md).*
