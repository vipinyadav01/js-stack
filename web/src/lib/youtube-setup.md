# YouTube Video Integration Setup

## How It Works

### Localhost (Development)

- **Automatic demo data**: Uses predefined demo video data
- **No API key needed**: Works out of the box for development
- **Console logging**: Shows "🏠 Localhost detected - using demo video data"

### Production

- **Real YouTube data**: Fetches actual video data from YouTube API
- **API key required**: Needs `NEXT_PUBLIC_YOUTUBE_API_KEY` environment variable
- **Fallback**: If no API key, falls back to mock data

## Setup for Production

### 1. Get YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

### 2. Add Environment Variable

Add to your `.env.local` or production environment:

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Update Video URLs

Replace the demo URLs in `web/src/lib/video-data.ts` with your actual YouTube URLs:

```typescript
export const videoTutorials: VideoTutorial[] = [
  {
    id: "1",
    url: "https://www.youtube.com/watch?v=YOUR_ACTUAL_VIDEO_ID",
    category: "tutorial",
  },
  // ... more videos
];
```

## Demo Data (Localhost)

The system includes demo data for these video IDs:

- `dQw4w9WgXcQ` - Complete JS-Stack Setup Tutorial
- `abc123def456` - Building a Modern Web App with JS-Stack
- `xyz789uvw012` - Advanced JS-Stack Features & Customization
- `def456ghi789` - JS-Stack CLI Deep Dive

## Environment Detection

The system automatically detects the environment:

```typescript
// Localhost detection
if (isLocalhost()) {
  // Use demo data
} else {
  // Use real YouTube API
}
```

## Console Messages

- **Localhost**: "🏠 Localhost detected - using demo video data"
- **Production**: "🌐 Production environment - fetching real YouTube data"
- **No API Key**: "YouTube API key not found, falling back to mock data"

## Testing

### Localhost Testing

1. Run `npm run dev`
2. Open browser console
3. Should see "🏠 Localhost detected - using demo video data"
4. Videos will show demo data

### Production Testing

1. Deploy with `NEXT_PUBLIC_YOUTUBE_API_KEY` set
2. Open browser console
3. Should see "🌐 Production environment - fetching real YouTube data"
4. Videos will show real YouTube data

## Troubleshooting

### Videos Not Loading

- Check if YouTube URL is valid
- Verify API key is correct
- Check browser console for errors

### API Quota Exceeded

- YouTube Data API has daily quotas
- Consider caching video data
- Use demo data for development

### CORS Issues

- YouTube API calls are made from client-side
- Ensure API key allows your domain
- Check API restrictions in Google Cloud Console
