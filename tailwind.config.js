/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vscode-bg': '#1e1e1e',
        'vscode-editor': '#252526',
        'vscode-sidebar': '#333333',
        'vscode-text': '#d4d4d4',
        'vscode-accent': '#007acc',
        'vscode-success': '#4ec9b0',
        'vscode-error': '#f48771',
        'vscode-warning': '#dcdcaa',
        'vscode-border': '#3c3c3c',
        'vscode-hover': '#2a2d2e',
        'vscode-active': '#094771',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        }
      }
    },
  },
  plugins: [],
}