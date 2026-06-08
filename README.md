# VS Code AI Client

<p align="center">
  <img src="public/vscode-icon.svg" width="100" alt="VS Code AI Logo">
</p>

<p align="center">
  <strong>IDE Inteligente com Chat Real-time</strong>
</p>

<p align="center">
  Um VS Code estilizado com integração de IA para assistance em tempo real
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#uso">Uso</a> •
  <a href="#extensões">Extensões</a> •
  <a href="#tecnologias">Tecnologias</a>
</p>

---

## ✨ Features

### 🤖 Chat em Tempo Real com IA
- Integração com Anthropic Claude API
- Respostas streaming em tempo real
- Animação de "pensando" com ondas
- Suporte a múltiplos provedores (Anthropic, OpenAI)

### 📁 File Explorer
- Árvore de arquivos completa
- Ícones para tipos de arquivo
- Arrastar e soltar para reorganizar
- Criar novo arquivo/pasta (right-click)

### 💻 Editor de Código
- Syntax highlighting (todos os languages)
- Monaco Editor com recursos completos
- Line numbers e minimap
- Tabs para múltiplos arquivos
- Auto-save

### 🧩 Subagentes
- Execute múltiplas IAs em paralelo
- Cada subagente com seu próprio chat
- Ideal para tarefas simultâneas (testes, review, documentação)

### 🎨 Sistema de Extensões
- Plugin system extensível
- Crie suas próprias extensões
- Carregar extensões da pasta `extensions/`

### ⌨️ Atalhos de Teclado
- `Ctrl+P` - Quick Open
- `Ctrl+K` - Command Palette
- `Ctrl+F` - Find
- `Ctrl+H` - Replace
- `Ctrl+S` - Save

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

```bash
# Clone o repositório
git clone https://github.com/Pedro21062014/vs-code-ai-client.git
cd vs-code-ai-client

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`

---

## 📖 Uso

### 1. Configure a API Key
1. Clique no botão "API Key" na barra de título
2. Selecione o provedor (Anthropic ou OpenAI)
3. Escolha o modelo desejado
4. Cole sua API key
5. Clique em "Test Connection" para verificar
6. Salve com "Save & Connect"

### 2. Abra um Arquivo
1. Navegue pelo Explorer na barra lateral esquerda
2. Clique em um arquivo para abri-lo no editor
3. O arquivo aparece em uma nova aba

### 3. Use o Chat
1. Digite sua mensagem no campo de chat
2. Pressione Enter para enviar
3. Aguarde a resposta da IA
4. Use os botões de ação nas respostas:
   - **Copy** - Copiar código
   - **Apply** - Aplicar ao editor
   - **Run** - Executar comando

### 4. Crie Subagentes
1. Clique no botão "+" próximo às abas de subagentes
2. Dê um nome ao subagente
3. Use-o para tarefas Paralelas

---

## 🧩 Extensões

### Estrutura de uma Extensão

```javascript
// extensions/my-extension.js
export function activate(context) {
  // Registrar comandos
  context.subscriptions.push(
    context.commands.registerCommand('myext.hello', () => {
      context.outputChannel.appendLine('Hello from extension!');
    })
  );
}

export function deactivate() {
  // Limpeza ao desativar
}
```

### Extensões Incluídas

| Extensão | Descrição |
|----------|-----------|
| Dark Theme | Tema escuro do VS Code |
| Syntax Highlighting | Highlight avançado de sintaxe |
| AI Helper | Atalhos para commands de IA |

---

## ⚙️ Configuração

### Settings Disponíveis

| Setting | Descrição | Padrão |
|---------|-----------|--------|
| AI Model | Modelo da IA | claude-3-5-sonnet |
| Auto-save | Salvar automaticamente | true |
| Font Size | Tamanho da fonte | 14px |
| Tab Size | Tamanho do tab | 2 |
| Theme | Tema claro/escuro | dark |

---

## 🛠️ Tecnologias

- **React 18** - UI Framework
- **Vite** - Build tool
- **Monaco Editor** - Code editor
- **Framer Motion** - Animações
- **Tailwind CSS** - Estilização
- **Zustand** - State management
- **Anthropic SDK** - Integração com Claude

---

## 📁 Estrutura do Projeto

```
vs-code-ai-client/
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Componente raiz
│   ├── components/
│   │   ├── Sidebar.jsx      # File Explorer
│   │   ├── Editor.jsx       # Monaco Editor
│   │   ├── Chat.jsx         # AI Chat
│   │   ├── Terminal.jsx     # Terminal
│   │   ├── SettingsModal.jsx
│   │   └── ApiKeyModal.jsx
│   ├── hooks/
│   │   ├── useEditor.js
│   │   ├── useChat.js
│   │   └── useFileSystem.js
│   ├── store/
│   │   └── useStore.js      # Zustand store
│   ├── utils/
│   │   ├── api.js           # API utilities
│   │   ├── storage.js       # localStorage
│   │   └── extensions.js    # Extension system
│   └── styles/
│       └── globals.css
├── public/
│   ├── index.html
│   └── vscode-icon.svg
├── extensions/              # User plugins
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 Design System

### Cores (Dark Theme)

| Nome | Hex | Uso |
|------|-----|-----|
| Background | `#1e1e1e` | Fundo principal |
| Editor BG | `#252526` | Fundo do editor |
| Sidebar BG | `#333333` | Fundo da sidebar |
| Text | `#d4d4d4` | Cor do texto |
| Accent | `#007acc` | Azul de destaque |
| Success | `#4ec9b0` | Verde de sucesso |
| Error | `#f48771` | Vermelho de erro |
| Warning | `#dcdcaa` | Amarelo de aviso |

---

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Créditos

Desenvolvido com ❤️ usando React, Monaco Editor e Framer Motion

---

<p align="center">
  Feito com ☕ e 🤖
</p>