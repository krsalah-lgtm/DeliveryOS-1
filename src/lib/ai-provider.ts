type AIResponse = {
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  merchantName: string | null;
  deliveryFee: number | null;
  totalOrderAmount: number | null;
  paymentMethod: string | null;
};

export async function extractOrderData(text: string): Promise<AIResponse | null> {
  // We check providers in order: Groq (Primary, fast/free), OpenAI (Fallback)
  const providers = [
    {
      name: 'Groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama3-8b-8192'
    },
    {
      name: 'OpenAI',
      url: 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini'
    }
  ];

  const systemPrompt = `You are a data extraction assistant. Extract order details from the user's message. 
  Respond ONLY with a valid JSON object matching this exact structure, using null if missing:
  {
    "customerName": "string or null",
    "customerPhone": "string or null",
    "customerAddress": "string or null",
    "merchantName": "string or null",
    "deliveryFee": number or null,
    "totalOrderAmount": number or null,
    "paymentMethod": "Cash" | "Settled" | "Online" or null
  }
  Do not invent data. Understand Arabic, English, and typos.`;

  for (const provider of providers) {
    if (!provider.key) continue; // Skip if you haven't provided a key for this service

    try {
      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.key}`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const extracted = JSON.parse(data.choices[0].message.content);
        return extracted;
      }
    } catch (error) {
      console.error(`${provider.name} failed. Trying next provider...`);
      // Fails silently and loops to the next provider
    }
  }

  // If all providers fail, return null so the application can handle it gracefully
  return null; 
}
