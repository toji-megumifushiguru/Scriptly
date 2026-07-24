# Scriptly - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 3. Try the Screenplay Generator
1. Navigate to http://localhost:3000/generator
2. Enter a story idea (e.g., "A detective discovers a hidden conspiracy")
3. Select a genre (Drama, Thriller, Comedy, etc.)
4. Choose a mood (Dark & Intense, Suspenseful, etc.)
5. Click "Generate Screenplay"
6. Wait 30-60 seconds for generation or instant with mock data
7. View the generated screenplay in the tabbed interface

## API Integration

### How It Works

The generator form submits to the `/api/generate` endpoint:

```
POST /api/generate
Content-Type: application/json

{
  "storyIdea": "Your story premise",
  "genre": "Thriller",
  "mood": "Suspenseful"
}
```

### Response Structure

The API returns a fully structured screenplay:

```json
{
  "screenplay": {
    "title": "Generated Title",
    "tagline": "One-line tagline",
    "logline": "Professional screenplay logline",
    "synopsis": "Full story summary",
    "characters": [...],
    "threeActStructure": [...],
    "scenes": [...],
    "metadata": {...}
  },
  "success": true
}
```

## Development Mode (Default)

By default, the API uses **mock data generation** which means:
- ✅ No API credentials needed
- ✅ Instant generation (development)
- ✅ Realistic screenplay structures
- ✅ Perfect for UI testing

The mock data generator creates screenplay content based on your inputs.

## Production Mode

To use the real AI Gateway for intelligent screenplay generation:

### 1. Set Environment Variable
```bash
export AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

### 2. Get an API Key
Visit: https://vercel.com/account/ai-gateway

### 3. Restart Server
```bash
pnpm dev
```

The API will now use Claude Opus 4.5 for intelligent generation.

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # 🎯 API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── generator/
│   │   └── page.tsx               # Generator page
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard page
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx           # Screenplay editor
│   └── globals.css                # Theme and styles
├── components/                     # React components
│   ├── generator-form.tsx         # Form with API integration
│   ├── screenplay-preview.tsx     # Preview display
│   ├── screenplay-card.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ...
├── lib/
│   └── types.ts                   # TypeScript interfaces
├── API.md                         # API documentation
└── package.json                   # Dependencies
```

## Features Implemented

### Frontend
- ✅ Landing page with hero section
- ✅ Feature cards showcase
- ✅ Testimonials section
- ✅ Responsive navigation
- ✅ Generator form with validation
- ✅ Screenplay preview (tabbed interface)
- ✅ Dashboard page
- ✅ Screenplay editor
- ✅ Framer Motion animations
- ✅ Dark cinematic UI theme
- ✅ Mobile responsive design

### Backend
- ✅ Screenplay generation API
- ✅ Structured output with Zod validation
- ✅ Error handling and logging
- ✅ Mock data fallback
- ✅ AI Gateway integration
- ✅ Full TypeScript support

## Building for Production

### 1. Build the App
```bash
pnpm build
```

### 2. Start Production Server
```bash
pnpm start
```

### 3. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The AI Gateway will automatically work with Vercel deployments.

## Testing the API Directly

### Using cURL
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "storyIdea": "A detective uncovers a conspiracy",
    "genre": "Thriller", 
    "mood": "Suspenseful"
  }'
```

### Using JavaScript
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storyIdea: 'Your story idea',
    genre: 'Thriller',
    mood: 'Suspenseful'
  })
})

const data = await response.json()
console.log(data.screenplay)
```

## Pages Available

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Hero page with features & testimonials |
| Generator | `/generator` | Create screenplays from story ideas |
| Dashboard | `/dashboard` | View saved screenplays |
| Editor | `/editor/[id]` | Professional screenplay editor |

## Styling

The app uses:
- **Tailwind CSS v4** for utility-first styling
- **Custom theme variables** in `globals.css`
- **Glassmorphism design** with backdrop blur
- **Gold (#d4af37)** primary color
- **Dark purple (#0f0f1e)** background
- **Cyan (#00d9ff)** accent color

### Customizing Colors

Edit `/app/globals.css` to change the theme:

```css
:root {
  --background: #0f0f1e;        /* Dark background */
  --foreground: #e0e0ff;        /* Light text */
  --primary: #d4af37;           /* Gold accent */
  --accent: #00d9ff;            /* Cyan accent */
  /* ... more colors ... */
}
```

## Troubleshooting

### API Not Generating
- Check that the dev server is running (`pnpm dev`)
- Verify the API route exists at `/app/api/generate/route.ts`
- Check console for error messages

### Mock Data Not Working
- Ensure mock fallback is in place in the API route
- Check `/app/api/generate/route.ts` for fallback function
- Restart dev server

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

### Port Already in Use
```bash
# Use different port
pnpm dev -- -p 3001
```

## Next Steps

1. **Read Full Documentation**: Check `API.md` for complete API reference
2. **Implementation Details**: See `IMPLEMENTATION.md` for technical details
3. **Add Database**: Integrate with Supabase/Neon to save screenplays
4. **Add Auth**: Implement user authentication
5. **Export Features**: Add PDF and Final Draft export functionality
6. **Deploy**: Push to Vercel for production

## Support

- 📖 API Documentation: See `API.md`
- 🛠️ Implementation Details: See `IMPLEMENTATION.md`
- 💬 AI SDK Docs: https://ai-sdk.dev/docs
- 🚀 Vercel Docs: https://vercel.com/docs

## License

Copyright © 2024 Scriptly. All rights reserved.

---

**Ready to generate screenplays?** Start with `pnpm dev` and navigate to http://localhost:3000/generator! 🎬✨
