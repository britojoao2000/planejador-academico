# Planejador Acadêmico Pessoal

Esta é uma Single-Page Application (SPA) construída com React, TypeScript, MUI e Firebase, projetada para ajudar estudantes a planejar sua trajetória acadêmica.

A aplicação é 100% client-side e usa o Firestore para persistência de dados, com autenticação anônima para garantir que cada usuário tenha seu próprio banco de dados.

## 🚀 Como Configurar e Rodar o Projeto

### 1. Configuração do Firebase

Este projeto requer o Firebase para funcionar.

1.  **Crie um Projeto:** Vá até o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2.  **Crie um App Web:** Dentro do seu projeto, clique no ícone `</>` para adicionar um novo "Aplicativo da Web". Dê um nome a ele.
3.  **Obtenha o `firebaseConfig`:** O Firebase fornecerá um objeto `firebaseConfig`. Copie este objeto.
4.  **Cole a Configuração:** Crie o arquivo `src/services/firebaseConfig.ts` e cole o objeto lá, como no exemplo:

    ```typescript
    // Em src/services/firebaseConfig.ts
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    // COLE SEU OBJETO DE CONFIGURAÇÃO AQUI
    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID",
    };

    // Inicializa o Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export { app, auth, db };
    ```

5.  **Ative a Autenticação Anônima:**
    * No menu do Firebase, vá para **Authentication**.
    * Clique na aba **Sign-in method**.
    * Clique em **Anônimo** (Anonymous) e ative o provedor.

6.  **Configure o Firestore:**
    * No menu, vá para **Firestore Database**.
    * Clique em **Criar banco de dados**.
    * Inicie no **Modo de Produção** (Production mode).
    * Vá para a aba **Regras** (Rules) e cole as regras abaixo.

### 2. Regras de Segurança do Firestore

Estas regras garantem que um usuário só possa ler e escrever *seus próprios* documentos. A coleção principal é `usuarios`, e cada usuário (identificado por seu `userId` anônimo) tem uma sub-coleção `disciplinas`.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite que um usuário leia/escreva apenas *seus próprios* documentos
    match /usuarios/{userId}/{documento=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Comandos NPM

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Criar build de produção (para deploy)
npm run build
```

## 🚀 Implantação no GitHub Pages

Para fazer o deploy no GitHub Pages, siga estes passos:

1.  **Configure o `vite.config.ts`:**
    * Abra o arquivo `vite.config.ts`.
    * Adicione a propriedade `base` com o nome do seu repositório no GitHub.

    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // [https://vitejs.dev/config/](https://vitejs.dev/config/)
    export default defineConfig({
      plugins: [react()],
      // MUDE "planejador-academico" PARA O NOME DO SEU REPOSITÓRIO
      base: '/planejador-academico/', 
    })
    ```

2.  **Configure o `package.json`:**
    * Adicione o script `deploy` e uma `homepage`:

    ```json
    {
      "name": "planejador-academico",
      "private": true,
      "version": "0.0.0",
      // ADICIONE A LINHA "homepage"
      "homepage": "[https://SEU-USUARIO-GITHUB.github.io/planejador-academico](https://SEU-USUARIO-GITHUB.github.io/planejador-academico)",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        // ADICIONE O SCRIPT "deploy"
        "deploy": "gh-pages -d dist"
      },
      // ... resto do arquivo
    }
    ```
    *Obs: Mude `SEU-USUARIO-GITHUB` e `planejador-academico` para seus valores.*

3.  **Faça o Deploy:**
    * Após fazer o `git init`, `git add .`, `git commit` e conectar ao seu repositório remoto:

    ```bash
    # 1. Crie a build de produção
    npm run build

    # 2. Envie a pasta 'dist' para a branch 'gh-pages'
    npm run deploy
    ```

4.  **Configure o GitHub:**
    * No seu repositório no GitHub, vá em **Settings** > **Pages**.
    * Em **Source**, selecione a branch `gh-pages` e a pasta `/ (root)`.
    * Salve e aguarde alguns minutos.