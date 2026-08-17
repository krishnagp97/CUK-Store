# CUK Store 🛍️

CUK Store is a full-stack **campus marketplace and Progressive Web App (PWA)**
built for students to buy and sell products within their college community.

---

## 🚀 Live Demo

**Production:** https://cuk-store.vercel.app

---

## 📸 Screenshots

### Home Page
![Home Page](./public/screenshots/home%20Page.png)

### Product Page
![Product Page](./public/screenshots/product%20Page.png)

### Sell Page
![Sell Page](./public/screenshots/sell%20Page.png)

### Wishlist
![Wishlist](./public/screenshots/wishList%20Page.png)

### Message List
![Message List](./public/screenshots/messageList%20Page.png)

### Conversation
![Conversation](./public/screenshots/conversation%20Page.png)

### Settings
![Settings](./public/screenshots/setting%20Page.png)

## ✨ Features

### 🔐 Authentication
- Email/password authentication
- Email verification
- Google OAuth authentication
- Secure session management with Better Auth

### 🛍️ Product Marketplace
- Create product listings
- Upload multiple product images
- Product categories
- Product descriptions
- Product pricing
- Browse available products
- Search and filter products
- Product detail pages
- Edit your listings
- Delete your listings
- Mark products as **Available** or **Sold**

### ❤️ Wishlist
- Add products to wishlist
- Remove products from wishlist
- View all saved products
- Sold products remain visible in the wishlist with their current status

### 💬 Real-Time Messaging
- Buyer-to-seller messaging
- Real-time message delivery using Ably
- Online status
- Typing indicator
- Message delivered status
- Message read status
- Conversation-based channels
- Infinite scrolling for older messages

### 📱 Responsive UI
- Mobile-first design
- Responsive layouts
- Desktop and mobile support
- shadcn/ui components
- Tailwind CSS
- Accessible UI components

### 📱 Progressive Web App (PWA)
- Installable on mobile and desktop
- App-like experience
- Responsive mobile-first design
- Custom app icon
- Standalone app experience
- Mobile navigation
- Prevents accidental zooming on mobile

### 🐳 Docker
- Multi-stage Docker build
- Production-optimized Next.js image
- Prisma Client generation during build
- Environment variables supplied securely
- Runs using Node.js Alpine image

### ☁️ Infrastructure & Deployment
- Deployed on Vercel
- PostgreSQL database
- Cloudinary image storage
- Ably real-time infrastructure

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React
- Progressive Web App (PWA)

### Backend
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- Better Auth
- Ably Realtime

### External Services

| Service | Purpose |
|---|---|
| Vercel | Application deployment |
| PostgreSQL / Neon | Database |
| Prisma | Database ORM |
| Cloudinary | Image storage |
| Better Auth | Authentication |
| Ably | Real-time messaging |
| SMTP | Email delivery |
| Docker | Containerization |

---

## 🏗️ Application Architecture

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │   React / Next.js   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │  Server + Client    │
                         │     Components      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   Prisma    │       │ Better Auth │       │    Ably     │
       │     ORM     │       │    Auth     │       │  Realtime   │
       └──────┬──────┘       └─────────────┘       └─────────────┘
              │
              ▼
       ┌─────────────┐
       │ PostgreSQL  │
       │  Database   │
       └─────────────┘

              ┌─────────────────────┐
              │     Cloudinary      │
              │    Image Storage    │
              └─────────────────────┘
```

---

## 📁 Project Structure

```text
CUK-Store/
│
├── app/
│   ├── api/
│   │   ├── ably/
│   │   ├── auth/
│   │   ├── message/
│   │   ├── messages/
│   │   ├── products/
│   │   └── wishlist/
│   │
│   ├── products/
│   ├── wishlist/
│   ├── myListings/
│   ├── messages/
│   ├── sell/
│   ├── sign-in/
│   ├── sign-up/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── message/
│   ├── products/
│   ├── wishlist/
│   └── ...
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── ably.ts
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── Dockerfile
├── .dockerignore
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone <your-github-repository-url>
cd CUK-Store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Then add your actual credentials to `.env.local`.


---

## 🔐 Environment Variables

The application uses the following environment variables:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

CRON_SECRET=

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

ABLY_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

The repository contains `.env.example` as a template.

### Production

For production deployment, use the deployed application URL:

```env
BETTER_AUTH_URL=https://cuk-store.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://cuk-store.vercel.app
NEXT_PUBLIC_APP_URL=https://cuk-store.vercel.app
```

Actual secret values should be configured through Vercel's environment-variable settings.

---

## 🗄️ Database Setup

CUK Store uses PostgreSQL with Prisma ORM.

Generate Prisma Client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev
```

Inspect the database:
```bash
npx prisma studio
```

---

## ▶️ Run Locally

Start the development server:
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🏭 Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

---

## 🐳 Docker

CUK Store can also be run as a production Docker container.

### Build the Docker Image

The Docker build uses BuildKit secrets for environment variables:
```bash
docker build --no-cache --secret id=env,src=.env -t cuk-store .
```

### Run the Container
```bash
docker run --rm --env-file .env -p 3000:3000 --name cuk-store-app cuk-store
```

Open: http://localhost:3000

### Check Running Containers
```bash
docker ps
```

### Check All Containers
```bash
docker ps -a
```

### Stop the Container
```bash
docker stop cuk-store-app
```

### Remove the Container
```bash
docker rm cuk-store-app
```

---

## 💬 Real-Time Messaging

Real-time messaging is implemented using Ably.

Each conversation has its own channel:
```text
conversation:<conversationId>
```

The messaging system supports:
- Real-time messages
- Typing indicators
- Online presence
- Message delivery status
- Message read status
- Conversation channels
- Pagination / infinite scrolling

Ably authentication is handled through:
```text
/api/ably/token
```

The server generates an Ably token request for the authenticated user.

---

## 🔑 Authentication

Authentication is handled using Better Auth.

Supported authentication methods:

```text
Email + Password
   ├── Email Verification
   └── Session

Google OAuth
   └── Session
```

Authentication-related routes are handled through:
```text
/api/auth/*
```

---

## ❤️ Wishlist

Users can save products to their wishlist.

Wishlist behavior:

```text
Available Product → Add to Wishlist → My Wishlist
```

If a seller changes a product from **AVAILABLE → SOLD**, the product is removed from the available marketplace but remains in existing wishlists with a **Sold** status.

This allows users to know that a previously saved product is no longer available.

---

## 🛍️ Product Lifecycle

A product follows this lifecycle:

```text
              ┌──────────────┐
              │    CREATE    │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  AVAILABLE   │
              └──────┬───────┘
                     │
              Seller marks sold
                     │
                     ▼
              ┌──────────────┐
              │     SOLD     │
              └──────┬───────┘
                     │
              Seller can restore
                     │
                     ▼
              ┌──────────────┐
              │  AVAILABLE   │
              └──────────────┘
```

---

## 📸 Image Storage

Product images are stored using Cloudinary.

The application supports multiple images per product. Images are uploaded to Cloudinary, and the corresponding image URLs are stored in PostgreSQL.

---

## 📱 Responsive Design

The application follows a mobile-first approach.

Supported layouts include:
```text
Mobile → Tablet → Desktop
```

The UI uses:
- Tailwind CSS
- shadcn/ui
- Responsive grid layouts
- Responsive navigation
- Mobile-friendly forms
- Responsive product cards
- Responsive messaging interface

---

## ☁️ Deployment

The application is deployed using Vercel.

### Vercel Setup
1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Configure production authentication URLs.
6. Verify database, authentication, Cloudinary, SMTP, and Ably connections.

**Production URL:** https://cuk-store.vercel.app

---

## 🔒 Security

Environment variables containing secrets must never be committed to GitHub.

The following files should remain local only:
```text
.env
.env.local
.env.*.local
```

The repository uses `.env.example` to document required environment variables without exposing their values.

---

## 🧪 Development Workflow

Typical development workflow:

```text
Code
 → Test locally
 → npm run build
 → Test Docker image
 → Git commit
 → Git push
 → Vercel deployment
```

Useful commands:
```bash
npm run dev
npm run build
npm start
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Docker:
```bash
docker build --no-cache --secret id=env,src=.env -t cuk-store .
docker run --rm --env-file .env -p 3000:3000 --name cuk-store-app cuk-store
```

---

## 🗺️ Future Improvements

- 🔔 Push notifications
- 💬 Chat notifications
- 🔎 Advanced product search
- 🧠 Product recommendations
- 🚨 Product reporting
- 👨‍💼 Admin dashboard
- 🛡️ Improved moderation
- 📊 Marketplace analytics
- ⚡ Further performance optimization
- 📦 Better product management
- 🔔 Real-time notification system

---

## 📚 Learning & Development

This project was built to gain practical experience with:
- Full-stack web development
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Authentication
- REST APIs
- Real-time communication
- Cloud storage
- Docker
- CI/CD
- Cloud deployment
- Responsive UI development

---

## 👨‍💻 Author

**Krishna Gopal**
B.Tech — Mathematics & Computing

Interested in:
- Full-Stack Development
- Next.js
- MERN Stack
- Backend Development
- Data Structures & Algorithms
- Machine Learning

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Suggestions, issues, and contributions are welcome.

---

## 📄 License

This project is currently intended as a personal/academic project.
