# MCU Tracker 🎬

Um site moderno e minimalista para acompanhar sua maratona do Universo Cinematográfico Marvel até **Vingadores: Doomsday**. Agora com sistema de login e progresso salvo na nuvem!

![MCU Tracker](https://img.shields.io/badge/MCU-Tracker-E62429?style=for-the-badge&logo=marvel)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)

## ✨ Funcionalidades

### 🎯 Principais
- 📅 **Duas ordens de visualização**: Cronológica (eventos na timeline do MCU) ou Lançamento
- ✅ **Marcar como assistido**: Clique nos cards para marcar filmes/séries como vistos
- 🔐 **Sistema de Login/Registro**: Crie sua conta para salvar progresso na nuvem
- ☁️ **Sincronização na nuvem**: Seu progresso fica salvo no MongoDB e acessível de qualquer dispositivo
- 📊 **Barra de progresso**: Acompanhe quantos % da jornada MCU você já completou
- 🎭 **Filtros**: Visualize apenas filmes, apenas séries ou todos
- 🖼️ **Capas reais dos filmes**: Imagens em alta qualidade do TMDB
- 📺 **Onde assistir**: Veja em qual plataforma cada título está disponível (Disney+, Cinemas, etc.)
- 💾 **Funciona offline**: Se não estiver logado, usa localStorage como fallback
- 🎨 **Design minimalista**: Interface clean inspirada no estilo Marvel
- ⚡ **Animações suaves**: Transições fluidas com Framer Motion
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

### 🆕 Novidades desta versão
- ✅ Sistema completo de autenticação (login/registro)
- ✅ Banco de dados MongoDB para salvar progresso do usuário
- ✅ Capas reais dos filmes/séries (TMDB)
- ✅ Informação "Onde Assistir" em cada card
- ✅ Cards menores e mais compactos
- ✅ Grid responsivo até 6 colunas em telas grandes

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos

### Backend & Database
- **MongoDB Atlas** - Banco de dados na nuvem
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **Next.js API Routes** - Backend serverless

## 📦 Instalação

1. Clone ou navegue até a pasta do projeto:
```bash
cd historico-filmes
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o MongoDB (já está configurado com a string de conexão fornecida):
```
mongodb+srv://nsnunes:magbserv01@frisck.8lr5dxi.mongodb.net/mcu-tracker
```

O banco de dados será criado automaticamente na primeira conexão!

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🎯 Como Usar

### 1. Criar Conta (Opcional mas Recomendado)
- Clique no botão **"Entrar"** no canto superior direito
- Escolha **"Cadastre-se"**
- Preencha seu nome, email e senha (mínimo 6 caracteres)
- Seu progresso será salvo automaticamente na nuvem!

### 2. Navegação
- **Escolha a ordem**: Alterne entre ordem cronológica (eventos do universo) ou ordem de lançamento (datas de estreia)
- **Filtre o conteúdo**: Use os botões para ver todos os itens, apenas filmes ou apenas séries
- **Marque como assistido**: Clique em qualquer card para marcar/desmarcar como assistido
- **Veja onde assistir**: Cada card mostra as plataformas disponíveis (Disney+, Cinemas)

### 3. Acompanhe o Progresso
- A barra no topo mostra sua porcentagem de conclusão da maratona MCU
- Badges coloridos indicam a Fase de cada produção
- Check verde aparece nos itens vistos

### 4. Logout
- Clique no botão **"Sair"** para fazer logout
- Seu progresso permanece salvo na nuvem e pode ser acessado de qualquer dispositivo

## 📊 Dados do MCU

O site inclui:
- **55 produções** do MCU (filmes e séries)
- Todas as **6 fases** do MCU
- De **Capitão América: O Primeiro Vingador** (1943 na timeline) até **Vingadores: Doomsday** (2026)
- Informações sobre duração, ano, fase, descrição e onde assistir
- Capas oficiais em alta qualidade

## 🗄️ Estrutura do Banco de Dados

### Collection: `users`
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (único),
  password: string (hash bcrypt),
  watchedItems: string[], // IDs dos filmes/séries assistidos
  createdAt: Date,
  updatedAt: Date
}
```

### Segurança
- Senhas são criptografadas com bcrypt (10 rounds)
- Autenticação via JWT com expiração de 7 dias
- Tokens armazenados no localStorage do navegador
- API routes protegidas com middleware de verificação

## 🎨 Paleta de Cores

- **Vermelho Marvel**: `#E62429`
- **Preto Profundo**: `#0A0A0A`
- **Cinza Escuro**: `#1A1A1A`
- **Cinza Claro**: `#2A2A2A`

## 📱 Responsividade

- **Mobile (< 640px)**: 2 colunas
- **Tablet (640-768px)**: 3 colunas
- **Desktop (768-1024px)**: 4 colunas
- **Desktop Large (1024-1536px)**: 5 colunas
- **Desktop XL (> 1536px)**: 6 colunas

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 📝 Estrutura do Projeto

```
historico-filmes/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts  # Registro de usuários
│   │   │   └── login/route.ts     # Login de usuários
│   │   └── user/
│   │       └── progress/route.ts  # Salvar/carregar progresso
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Página inicial (com auth)
│   └── globals.css                # Estilos globais
├── components/
│   ├── Header.tsx                 # Cabeçalho com login/logout
│   ├── MCUCard.tsx                # Card de filme/série (com imagens)
│   ├── AuthModal.tsx              # Modal de login/registro
│   ├── OrderToggle.tsx            # Toggle de ordem
│   ├── FilterBar.tsx              # Barra de filtros
│   └── ProgressBar.tsx            # Barra de progresso
├── data/
│   └── mcu-data.ts                # Dados dos filmes/séries (com URLs e whereToWatch)
├── lib/
│   └── mongodb.ts                 # Configuração MongoDB
├── models/
│   └── User.ts                    # Schema do usuário
└── package.json
```

## 🎬 Ordem Cronológica vs Lançamento

**Ordem Cronológica**: Segue a timeline dos eventos dentro do universo Marvel
- Exemplo: Capitão América (anos 40) vem antes de Homem de Ferro (2008)
- Capitã Marvel (anos 90) vem em segundo lugar

**Ordem de Lançamento**: Segue a ordem em que os filmes/séries foram lançados nos cinemas/streaming
- Exemplo: Homem de Ferro (2008) vem antes de Capitão América (2011)

## 🌟 Próximos Lançamentos

O site está preparado para a maratona até:
- **Vingadores: Doomsday** (1 de Maio de 2026)

Inclui também os próximos lançamentos:
- Capitão América: Admirável Mundo Novo (Fevereiro 2025)
- Thunderbolts* (Maio 2025)
- Quarteto Fantástico: Primeiros Passos (Julho 2025)
- E as séries Demolidor: Renascido e Ironheart!

## 🔒 Segurança e Privacidade

- Senhas nunca são armazenadas em texto puro
- Conexão segura com MongoDB Atlas (SSL/TLS)
- Tokens JWT com expiração automática
- Validação de dados no backend
- Headers de segurança configurados

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel deploy
```

Não esqueça de adicionar as variáveis de ambiente:
- `JWT_SECRET` (opcional, já tem um padrão)

### Outros Providers
O projeto funciona em qualquer plataforma que suporte Next.js 15:
- Netlify
- Railway
- AWS
- Google Cloud

## 🤝 Contribuindo

Sugestões de melhorias:
- [ ] Adicionar trailers dos filmes
- [ ] Sistema de avaliação por estrelas
- [ ] Compartilhar progresso nas redes sociais
- [ ] Notificações de novos lançamentos
- [ ] Dark/Light mode toggle
- [ ] Exportar progresso em PDF
- [ ] Integração com Letterboxd

## 📄 Licença

Este é um projeto pessoal para fins educacionais. Todos os direitos dos filmes e séries pertencem à Marvel Studios e Disney.

## 🎉 Tecnologias Aprendidas Neste Projeto

- Next.js 15 App Router
- MongoDB com Mongoose
- Autenticação JWT
- API Routes do Next.js
- TypeScript avançado
- Framer Motion
- Tailwind CSS
- bcrypt e segurança
- LocalStorage como fallback
- Responsive design
- External APIs (TMDB)

---

**Feito com ❤️ para os fãs do MCU**

Pronto para sua maratona até Vingadores: Doomsday! 🦸‍♂️🦸‍♀️
