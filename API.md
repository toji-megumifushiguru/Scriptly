# Scriptly AI Screenplay Generation API

## Overview

The Scriptly API provides intelligent screenplay generation powered by AI. It accepts a story idea along with genre and mood preferences, then returns a fully structured screenplay with professional formatting.

## Endpoint

### Generate Screenplay

**POST** `/api/generate`

Generates a professional screenplay based on the provided story idea and preferences.

## Request

### Headers

```
Content-Type: application/json
```

### Body

```typescript
{
  storyIdea: string    // The story premise/idea (required)
  genre: string        // Genre: Drama, Comedy, Thriller, Action, Romance, Science Fiction, Fantasy, Horror, Adventure, Documentary (required)
  mood: string         // Tone/mood: Dark & Intense, Light & Fun, Romantic, Suspenseful, Inspiring, Melancholic, Epic, Mysterious (required)
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "storyIdea": "A detective uncovers a conspiracy that reaches the highest levels of government",
    "genre": "Thriller",
    "mood": "Suspenseful"
  }'
```

## Response

### Success (200 OK)

```typescript
{
  screenplay: {
    title: string                    // Generated screenplay title
    tagline: string                  // One-line tagline capturing the essence
    logline: string                  // Professional screenplay logline
    synopsis: string                 // 2-3 paragraph story summary
    characters: Array<{
      name: string                   // Character name
      role: string                   // Role in story (protagonist, antagonist, supporting)
      description: string            // Physical appearance and personality
      arcType: string                // Character arc type (hero, mentor, shadow, etc.)
    }>
    threeActStructure: Array<{
      number: number                 // Act number (1, 2, or 3)
      title: string                  // Act theme/title
      description: string            // Description of major events
      keyPlotPoints: string[]         // Key turning points in the act
    }>
    scenes: Array<{
      number: number                 // Scene sequence number
      heading: string                // Screenplay heading format (INT./EXT., LOCATION, TIME)
      setting: string                // Description of the setting
      description: string            // What happens in the scene
      pageCount: number              // Estimated page count
    }>
    metadata: {
      genre: string                  // Input genre
      mood: string                   // Input mood/tone
      generatedAt: string            // ISO timestamp of generation
    }
  },
  success: boolean                   // Whether generation succeeded
}
```

### Error (400/500)

```typescript
{
  screenplay: null,
  success: false,
  error: string                      // Error message
}
```

### Example Response

```json
{
  "screenplay": {
    "title": "Dark A",
    "tagline": "A suspenseful tale of mystery and transformation",
    "logline": "When a detective uncovers a conspirac... everything changes.",
    "synopsis": "In a world where a detective uncovers a conspiracy that reaches the highest levels of government while protecting a secret that could change everything, a protagonist must navigate dangerous waters and make impossible choices...",
    "characters": [
      {
        "name": "Alex Morgan",
        "role": "Protagonist",
        "description": "A determined individual caught in the center of thriller circumstances",
        "arcType": "Hero's Journey"
      },
      {
        "name": "Jordan Cross",
        "role": "Antagonist",
        "description": "A complex figure with hidden motivations and a darker past",
        "arcType": "Shadow"
      }
    ],
    "threeActStructure": [
      {
        "number": 1,
        "title": "Inciting Incident",
        "description": "The story begins with a detective uncovers a conspiracy that reaches the highest levels of government while protecting a secret that could change everything...",
        "keyPlotPoints": [
          "Protagonist introduced in ordinary circumstances",
          "The inciting incident occurs, disrupting the status quo",
          "Protagonist hesitates but accepts the challenge",
          "First challenge tests their resolve"
        ]
      }
    ],
    "scenes": [
      {
        "number": 1,
        "heading": "INT. CITY APARTMENT - NIGHT",
        "setting": "A modest apartment overlooking the city skyline",
        "description": "The protagonist wakes from a troubled sleep, their phone buzzing with urgent messages",
        "pageCount": 2
      }
    ],
    "metadata": {
      "genre": "Thriller",
      "mood": "Suspenseful",
      "generatedAt": "2024-07-24T15:30:00.000Z"
    }
  },
  "success": true
}
```

## Usage in Frontend

The API is integrated with the Scriptly generator form. When users fill out the form with:
- A story idea
- Genre selection
- Mood/tone preference

The form sends a POST request to `/api/generate` and displays the results in a tabbed interface showing:
- Overview (logline & synopsis)
- Characters
- Three-act structure with plot points
- Scene breakdown with page counts

## Implementation Details

### Development Mode

When the AI Gateway is not available (missing API key or credit card), the API automatically falls back to mock data that still provides a fully structured screenplay with realistic content. This allows for development and testing without requiring API credentials.

### Production Mode

For production deployment, ensure the `AI_GATEWAY_API_KEY` environment variable is set with valid credentials. The API will then use Claude Opus 4.5 via the Vercel AI Gateway for intelligent screenplay generation with structured output validation using Zod schemas.

### Models Used

- **Primary**: `anthropic/claude-opus-4.5` - For best creative quality and structured output
- **Fallback**: Mock data generator - For development without API access

## Error Handling

The API validates all required fields and returns appropriate error messages:

- **400 Bad Request**: Missing required fields (storyIdea, genre, mood)
- **500 Internal Server Error**: API or generation failure (will use mock data in development)

## Rate Limiting

No rate limiting is currently implemented. For production use, consider adding rate limiting middleware to prevent abuse.

## Examples

### JavaScript/Fetch

```javascript
async function generateScreenplay(storyIdea, genre, mood) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      storyIdea,
      genre,
      mood,
    }),
  })

  const data = await response.json()
  if (data.success) {
    console.log('Generated screenplay:', data.screenplay)
  } else {
    console.error('Generation failed:', data.error)
  }
}

generateScreenplay(
  'A detective discovers a hidden conspiracy',
  'Thriller',
  'Suspenseful'
)
```

### Python/Requests

```python
import requests

def generate_screenplay(story_idea, genre, mood):
    response = requests.post(
        'http://localhost:3000/api/generate',
        json={
            'storyIdea': story_idea,
            'genre': genre,
            'mood': mood,
        }
    )
    
    data = response.json()
    if data['success']:
        print('Generated screenplay:', data['screenplay'])
    else:
        print('Generation failed:', data['error'])

generate_screenplay(
    'A detective discovers a hidden conspiracy',
    'Thriller',
    'Suspenseful'
)
```

## Future Enhancements

- Add optional parameters for screenplay length/depth control
- Support additional AI models for cost optimization
- Implement screenplay export formats (PDF, Final Draft .fdx)
- Add streaming responses for real-time generation feedback
- Support for multi-language screenplay generation
