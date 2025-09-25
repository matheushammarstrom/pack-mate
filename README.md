# ✈️ Pack Mate - Travel Packing List Generator

A modern full-stack web application to create and manage travel packing lists. Built with Next.js, tRPC, Prisma, and TailwindCSS, designed to be simple, collaborative, and extendable.

## 🚀 Features

- **Trip Management**: Create trips with destination, dates, and duration
- **Smart Packing Lists**: Auto-generate or manually add packing items
- **Item Categorization**: Organize items by categories (clothes, electronics, documents, etc.)
- **Packing Status**: Mark items as packed/unpacked with visual progress tracking
- **Reusable Templates**: Save and reuse packing templates for different trip types
- **Future Features**: Share lists with other users and AI-powered suggestions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **API**: tRPC for type-safe API calls
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: NextAuth.js (email + OAuth ready)
- **State Management**: TanStack Query (integrated with tRPC)
- **Deployment**: Vercel (frontend + API), Database on Supabase/Neon

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pack-mate
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
