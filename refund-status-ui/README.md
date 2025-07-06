# Refund Status UI

## Installation and Usage

1. Install [nvm]() (Node Version Manager) if you haven't already. This allows you to manage multiple Node.js versions easily.
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```
   After installation, you may need to restart your terminal or run the following command to load nvm:
   ```bash
   source ~/.nvm/nvm.sh
   ```
2. Install Node.js using nvm
   ```bash
   nvm install 24
   nvm use
   ```
3. Install dependencies
   ```bash
    npm install
    ```
4. Start the development server
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Commands

- **Start the development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Run tests**: `npm run test`
- **Run tests in watch mode**: `npm run test:watch`
- **Run tests with coverage**: `npm run test:coverage`
- **Run tests with coverage UI**: `npm run test:coverage:ui`
- **Lint the code**: `npm run lint`
- **Lint the code and fix issues**: `npm run lint:fix`
- **Format the code**: `npm run format`
- **Format the code and fix issues**: `npm run format:fix`

