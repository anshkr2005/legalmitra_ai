// Chat functionality
class ChatApp {
  constructor() {
    this.currentLanguage = "english"
    this.messages = []
    this.isLoading = false
    this.sessionId = null // Add session ID tracking

    this.initializeElements()
    this.bindEvents()
    this.addWelcomeMessage()
  }

  initializeElements() {
    this.chatMessages = document.getElementById("chat-messages")
    this.chatInput = document.getElementById("chat-input")
    this.sendButton = document.getElementById("send-button")
    this.langEnglish = document.getElementById("lang-english")
    this.langHindi = document.getElementById("lang-hindi")
    this.quickQuestions = document.querySelectorAll(".quick-question")
  }

  bindEvents() {
    // Send button click
    this.sendButton.addEventListener("click", () => this.sendMessage())

    // Enter key press
    this.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    // Language toggle
    this.langEnglish.addEventListener("click", () => this.setLanguage("english"))
    this.langHindi.addEventListener("click", () => this.setLanguage("hindi"))

    // Quick questions
    this.quickQuestions.forEach((button) => {
      button.addEventListener("click", () => {
        const question =
          this.currentLanguage === "english"
            ? button.getAttribute("data-question")
            : button.getAttribute("data-question-hi")
        this.chatInput.value = question
        this.sendMessage()
      })
    })

    // Auto-resize input
    this.chatInput.addEventListener("input", () => {
      this.chatInput.style.height = "auto"
      this.chatInput.style.height = this.chatInput.scrollHeight + "px"
    })
  }

  setLanguage(language) {
    this.currentLanguage = language

    // Update button states
    this.langEnglish.classList.toggle("active", language === "english")
    this.langHindi.classList.toggle("active", language === "hindi")

    // Update placeholder
    this.chatInput.placeholder = language === "english" ? "Ask your legal question..." : "अपना कानूनी प्रश्न पूछें..."
  }

  addWelcomeMessage() {
    const welcomeMessage =
      this.currentLanguage === "english"
        ? "नमस्ते! I'm LegalMitra, your AI legal assistant. I can help you with Indian laws including IPC, CrPC, CPC, Property Law, Consumer Protection, and more. How can I assist you today?"
        : "नमस्ते! मैं LegalMitra हूं, आपका AI कानूनी सहायक। मैं आपकी भारतीय कानूनों में मदद कर सकता हूं जैसे IPC, CrPC, CPC, संपत्ति कानून, उपभोक्ता संरक्षण, और अन्य। आज मैं आपकी कैसे सहायता कर सकता हूं?"

    this.addMessage(welcomeMessage, false)
  }

  async sendMessage() {
    const message = this.chatInput.value.trim()
    if (!message || this.isLoading) return

    // Add user message
    this.addMessage(message, true)
    this.chatInput.value = ""
    this.chatInput.style.height = "auto"

    // Show loading
    this.setLoading(true)
    this.showTypingIndicator()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message, // Changed from messages array to single message
          language: this.currentLanguage,
          session_id: this.sessionId || "new-session", // Added session ID
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.hideTypingIndicator()

      // Store session ID if returned
      if (data.session_id) {
        this.sessionId = data.session_id
      }

      if (data.response) {
        this.addMessage(data.response, false)
      } else if (data.error) {
        this.addMessage(`Error: ${data.error}. Please try again.`, false)
        console.error("API Error:", data.error)
      }
    } catch (error) {
      this.hideTypingIndicator()
      this.addMessage("Sorry, there was an error connecting to the server. Please try again later.", false)
      console.error("Error:", error)
    } finally {
      this.setLoading(false)
    }
  }

  addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isUser ? "user-message" : "assistant-message"}`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = isUser ? '<i data-lucide="user"></i>' : '<i data-lucide="bot"></i>'

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    const messageText = document.createElement("p")
    messageText.innerHTML = this.formatMessage(content)

    const messageTime = document.createElement("div")
    messageTime.className = "message-time"
    messageTime.textContent = new Date().toLocaleTimeString()

    messageContent.appendChild(messageText)
    messageContent.appendChild(messageTime)

    messageDiv.appendChild(avatar)
    messageDiv.appendChild(messageContent)

    this.chatMessages.appendChild(messageDiv)
    this.scrollToBottom()

    // Initialize icons for new message
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }

    // Store message
    this.messages.push({ content, isUser, timestamp: new Date() })
  }

  formatMessage(content) {
    // Format legal response sections
    let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")

    // Highlight legal sections
    if (content.includes("**Applicable Sections:**")) {
      formatted = formatted.replace(
        /<strong>Applicable Sections:<\/strong>/g,
        '<div class="legal-section"><strong>⚖️ Applicable Sections:</strong>',
      )
    }

    if (content.includes("**Required Documents:**")) {
      formatted = formatted.replace(
        /<strong>Required Documents:<\/strong>/g,
        '</div><div class="legal-section"><strong>📄 Required Documents:</strong>',
      )
    }

    if (content.includes("**Timeline:**")) {
      formatted = formatted.replace(
        /<strong>Timeline:<\/strong>/g,
        '</div><div class="legal-section"><strong>⏰ Timeline:</strong>',
      )
    }

    if (content.includes("**Disclaimer:**")) {
      formatted = formatted.replace(
        /<strong>Disclaimer:<\/strong>/g,
        '</div><div class="legal-disclaimer"><strong>⚠️ Disclaimer:</strong>',
      )
      formatted += "</div>"
    }

    return formatted
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.id = "typing-indicator"
    typingDiv.className = "message assistant-message"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = '<i data-lucide="bot"></i>'

    const content = document.createElement("div")
    content.className = "message-content"

    const typingContent = document.createElement("div")
    typingContent.className = "typing-indicator"
    typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `

    content.appendChild(typingContent)
    typingDiv.appendChild(avatar)
    typingDiv.appendChild(content)

    this.chatMessages.appendChild(typingDiv)
    this.scrollToBottom()

    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  setLoading(loading) {
    this.isLoading = loading
    this.sendButton.disabled = loading
    this.chatInput.disabled = loading

    if (loading) {
      this.sendButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i>'
    } else {
      this.sendButton.innerHTML = '<i data-lucide="send"></i>'
    }

    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight
  }
}

// Initialize chat when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp()

  // Add custom styles for legal sections
  const style = document.createElement("style")
  style.textContent = `
        .legal-section {
            background: rgba(102, 126, 234, 0.1);
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 0.5rem;
            border-left: 4px solid #667eea;
        }
        
        .legal-disclaimer {
            background: rgba(239, 68, 68, 0.1);
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 0.5rem;
            border-left: 4px solid #ef4444;
            font-size: 0.875rem;
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `
  document.head.appendChild(style)
})
