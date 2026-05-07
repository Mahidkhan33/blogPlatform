# 🖋️ Blog Platform - Modern Writing Experience

A premium, state-of-the-art blog platform built with Next.js, featuring AI-powered content generation, a professional Tiptap-based editor, and a sleek, modern dashboard.

![Dashboard Preview](https://res.cloudinary.com/dzvk7w6jx/image/upload/v1714987000/dashboard_preview.png) *(Placeholder - Replace with actual screenshot)*

## ✨ Features

- 🚀 **Modern Dashboard**: A clean, high-performance interface to manage your stories and track engagement.
- 🤖 **AI Content Generation**: Leverage Google Gemini AI to generate catchy titles, excerpts, and full blog posts from a simple topic.
- ✍️ **Professional Editor**: A rich-text editor powered by Tiptap with support for bold, italic, headings, lists, images, and custom styling.
- 🔐 **Secure Authentication**: Robust user authentication and role-based access control using NextAuth.js.
- 🖼️ **Image Management**: Seamlessly upload and manage cover images with Cloudinary integration.
- 🌓 **Dark Mode**: Beautifully crafted dark and light modes for a comfortable reading and writing experience.
- 📱 **Fully Responsive**: Optimized for every screen size, from desktop to mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **AI**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **File Uploads**: [Cloudinary](https://cloudinary.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Mahidkhan33/blogPlatform.git
cd blogPlatform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components and the specialized Tiptap editor.
- `src/lib`: Utility functions, database connection, and authentication configuration.
- `src/models`: Mongoose schemas for Users, Posts, Comments, and more.
- `public`: Static assets and images.

## 📜 License

This project is licensed under the MIT License.
