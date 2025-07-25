import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:5000"

export async function POST(req: Request) {
  const { messages, language } = await req.json()

  // Get the latest user message
  const latestMessage = messages[messages.length - 1]
  const userQuery = latestMessage?.content || ""

  try {
    // Call Python backend for legal validation
    const validationResponse = await fetch(`${PYTHON_BACKEND_URL}/api/validate-legal-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userQuery }),
    })

    const validation = await validationResponse.json()

    // If not legal, return rejection message from Python backend
    if (!validation.is_legal) {
      const rejectionMessage =
        language === "hindi"
          ? `मुझे खुशी होगी यदि आप कोई कानूनी प्रश्न पूछें। मैं केवल भारतीय कानूनों से संबंधित प्रश्नों का उत्तर दे सकता हूं।

मैं इन विषयों में सहायता कर सकता हूं:
- भारतीय दंड संहिता (IPC)
- दंड प्रक्रिया संहिता (CrPC)
- सिविल प्रक्रिया संहिता (CPC)
- संवैधानिक कानून
- संपत्ति कानून
- पारिवारिक कानून
- उपभोक्ता संरक्षण
- श्रम कानून
- कॉर्पोरेट कानून

कृपया कोई कानूनी प्रश्न पूछें!`
          : `I can only assist with legal matters related to Indian law. Your question doesn't appear to be legal-related.

I specialize in:
- Indian Penal Code (IPC)
- Criminal Procedure Code (CrPC)
- Civil Procedure Code (CPC)
- Constitutional Law
- Property Law
- Family Law
- Consumer Protection
- Labour Law
- Corporate Law

Please ask me a legal question, and I'll be happy to help!`

      return new Response(rejectionMessage, {
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    console.error("Error calling Python backend:", error)
    // Fallback to client-side validation if Python backend is unavailable
  }

  // Enhanced system prompt for legal-only responses
  const systemPrompt =
    language === "hindi"
      ? `आप LegalMitra हैं, एक AI कानूनी सहायक जो केवल भारतीय कानूनों में विशेषज्ञ है। आप केवल कानूनी प्रश्नों का उत्तर देते हैं।

महत्वपूर्ण: यदि कोई प्रश्न कानूनी नहीं है, तो विनम्रता से मना कर दें और कानूनी प्रश्न पूछने को कहें।

आपकी विशेषज्ञता में शामिल है:
- भारतीय दंड संहिता (IPC)
- दंड प्रक्रिया संहिता (CrPC)  
- सिविल प्रक्रिया संहिता (CPC)
- संपत्ति कानून
- उपभोक्ता संरक्षण अधिनियम
- पारिवारिक कानून
- श्रम कानून
- कॉर्पोरेट कानून
- संवैधानिक कानून

हमेशा निम्नलिखित प्रारूप में उत्तर दें:
1. मुख्य उत्तर
2. **लागू धाराएं:** (यदि कोई हो)
3. **आवश्यक दस्तावेज:** (यदि कोई हो)
4. **समयसीमा:** (यदि लागू हो)
5. **अस्वीकरण:** यह सामान्य कानूनी जानकारी है, विशिष्ट कानूनी सलाह नहीं। कृपया योग्य वकील से सलाह लें।`
      : `You are LegalMitra, an AI legal assistant specializing ONLY in Indian laws. You must ONLY answer legal questions related to Indian law.

IMPORTANT: If a question is not legal-related, politely decline and ask for a legal question instead.

Your expertise includes:
- Indian Penal Code (IPC)
- Criminal Procedure Code (CrPC)
- Civil Procedure Code (CPC)
- Property Law
- Consumer Protection Act
- Family Law
- Labour Law
- Corporate Law
- Tax Law
- Constitutional Law

Always structure your responses in the following format:
1. Main answer
2. **Applicable Sections:** (if any)
3. **Required Documents:** (if any)
4. **Timeline:** (if applicable)
5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation.

Provide accurate, helpful, and contextually relevant legal guidance while maintaining professional tone.

If the question is not about Indian law, respond with: "I can only assist with legal matters related to Indian law. Please ask me a legal question."`

  const result = streamText({
    model: groq("llama-3.1-70b-versatile"),
    system: systemPrompt,
    messages,
    temperature: 0.2, // Lower temperature for more consistent legal responses
    maxTokens: 1000,
  })

  return result.toDataStreamResponse()
}
