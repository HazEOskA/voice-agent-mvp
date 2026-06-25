const RESPONSES: Record<string, string> = {
  hello: 'Hello! How can I help you today?',
  hi: 'Hi there! What can I do for you?',
  'how are you': "I'm doing great, thanks for asking! I'm a voice agent demo.",
  'what can you do': 'I can listen to your voice, process your words, and speak back to you. In future versions I will connect to a real AI model.',
  weather: "I don't have live weather data yet, but in a future version I'll be able to check that for you.",
  time: `The current time is ${new Date().toLocaleTimeString()}.`,
  name: "I'm the Voice Agent MVP — a browser-based voice assistant demo.",
  help: 'Try saying hello, asking how I am, or asking what I can do.',
};

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z\s]/g, '');
}

export function getMockResponse(transcript: string): string {
  const input = normalize(transcript);

  for (const [key, response] of Object.entries(RESPONSES)) {
    if (input.includes(key)) {
      return response;
    }
  }

  return `You said: "${transcript}". I'm a mock agent — real AI responses are coming in v0.2!`;
}
