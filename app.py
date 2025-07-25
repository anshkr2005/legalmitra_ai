from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import json
import re
from datetime import datetime
import logging
import requests
import sys
import uuid
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask appfrom flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import json
import re
from datetime import datetime
import logging
import requests
import sys
import uuid
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Get Groq API key from environment
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', 'your_groq_api_key_here')

# Initialize Groq client with your API key
try:
    client = Groq(api_key="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")
    print("✅ Groq client initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Groq client: {str(e)}")
    client = None

class LegalValidator:
    """Validates if queries are legal-related and processes them accordingly"""
    
    def __init__(self):
        # Legal keywords and patterns
        self.legal_keywords = {
            'laws': ['ipc', 'crpc', 'cpc', 'constitution', 'act', 'section', 'article', 'law', 'legal', 'court', 'judge'],
            'legal_areas': ['criminal', 'civil', 'property', 'family', 'consumer', 'labour', 'corporate', 'tax', 'constitutional'],
            'legal_actions': ['file', 'case', 'petition', 'appeal', 'bail', 'divorce', 'registration', 'complaint', 'fir'],
            'legal_entities': ['lawyer', 'advocate', 'attorney', 'court', 'tribunal', 'police', 'magistrate', 'judge'],
            'legal_documents': ['contract', 'agreement', 'will', 'deed', 'affidavit', 'notice', 'summons', 'warrant'],
            'rights_duties': ['rights', 'duties', 'obligations', 'liability', 'compensation', 'damages', 'penalty']
        }
        
        # Hindi legal terms
        self.hindi_legal_terms = [
            'कानून', 'न्यायालय', 'वकील', 'न्यायाधीश', 'मुकदमा', 'अपील', 'जमानत', 
            'तलाक', 'संपत्ति', 'अधिकार', 'कर्तव्य', 'दंड', 'जुर्माना', 'क्षतिपूर्ति',
            'आईपीसी', 'सीआरपीसी', 'सीपीसी', 'संविधान', 'धारा', 'अनुच्छेद'
        ]
        
        # Non-legal patterns to reject
        self.non_legal_patterns = [
            r'\b(weather|sports|cooking|music|movies|games|entertainment)\b',
            r'\b(programming|coding|software|technology|computer)\b',
            r'\b(health|medical|doctor|medicine|disease)\b',
            r'\b(travel|tourism|vacation|holiday)\b',
            r'\b(food|recipe|restaurant|cuisine)\b'
        ]
    
    def is_legal_query(self, query):
        """Determines if a query is legal-related"""
        query_lower = query.lower()
        
        # Check for non-legal patterns first
        for pattern in self.non_legal_patterns:
            if re.search(pattern, query_lower, re.IGNORECASE):
                return False, "non_legal", 0.0
        
        legal_score = 0
        total_words = len(query.split())
        matched_categories = []
        
        # Check English legal terms
        for category, keywords in self.legal_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in query_lower)
            if matches > 0:
                legal_score += matches
                matched_categories.append(category)
        
        # Check Hindi legal terms
        hindi_matches = sum(1 for term in self.hindi_legal_terms if term in query)
        if hindi_matches > 0:
            legal_score += hindi_matches * 2
            matched_categories.append('hindi_legal')
        
        # Calculate confidence score
        confidence = min(legal_score / max(total_words, 1.0), 1.0)
        
        # Determine if it's legal (threshold: 0.1)
        is_legal = confidence >= 0.1 or any(cat in matched_categories for cat in ['laws', 'legal_areas', 'legal_actions'])
        
        primary_category = matched_categories[0] if matched_categories else "general_legal"
        
        return is_legal, primary_category, confidence

class LegalKnowledgeBase:
    """Comprehensive legal knowledge base for Indian laws"""
    
    def __init__(self):
        self.ipc_sections = {
            "302": {
                "title": "Punishment for murder",
                "description": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
                "punishment": "Death or life imprisonment + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Sessions Court"
            },
            "420": {
                "title": "Cheating and dishonestly inducing delivery of property",
                "description": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
                "punishment": "Imprisonment up to 7 years + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Magistrate"
            },
            "498A": {
                "title": "Husband or relative of husband of a woman subjecting her to cruelty",
                "description": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
                "punishment": "Imprisonment up to 3 years + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Magistrate"
            }
        }
        
        self.constitutional_articles = {
            "21": {
                "title": "Protection of life and personal liberty",
                "description": "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
                "fundamental_right": True,
                "category": "Right to Life and Liberty"
            },
            "14": {
                "title": "Equality before law",
                "description": "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
                "fundamental_right": True,
                "category": "Right to Equality"
            },
            "19": {
                "title": "Protection of certain rights regarding freedom of speech etc.",
                "description": "All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout the territory of India, to reside and settle in any part of the territory of India, and to practise any profession, or to carry on any occupation, trade or business.",
                "fundamental_right": True,
                "category": "Right to Freedom"
            }
        }
    
    def get_section_info(self, section, act="ipc"):
        """Get information about a specific legal section"""
        if act.lower() == "ipc" and section in self.ipc_sections:
            return self.ipc_sections[section]
        return None
    
    def get_article_info(self, article):
        """Get information about a constitutional article"""
        return self.constitutional_articles.get(article)

# Initialize components
validator = LegalValidator()
knowledge_base = LegalKnowledgeBase()

# Define system prompt and legal keywords
SYSTEM_PROMPT = """You are LegalMitra, an AI legal assistant specializing in Indian law. Provide accurate and helpful information about Indian legal topics. Always structure your responses clearly and concisely.

1. Main answer
2. **Applicable Sections:** (if any)
3. **Required Documents:** (if any)
4. **Timeline:** (if applicable)
5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."""

LEGAL_KEYWORDS = [
    'law', 'legal', 'court', 'judge', 'ipc', 'crpc', 'cpc', 'constitution', 
    'section', 'article', 'property', 'family', 'criminal', 'civil'
]

# Chat sessions
chat_sessions = {}

def is_legal_query(query):
    """Enhanced check to determine if a query is legal-related"""
    query_lower = query.lower()
    
    # Basic legal keywords - made more comprehensive
    basic_legal_keywords = [
       'ipc', 'crpc', 'cpc', 'constitution', 'section', 'legal notice', 'bail', 'divorce',
    'fir', 'court', 'judge', 'advocate', 'lawyer', 'petition', 'litigation', 'consumer protection',
    'transfer of property act', '498a', 'rape', 'section 377', 'defamation', 'murder', 'pocso',
    'maintenance', 'inheritance', 'arbitration', 'tribunal', 'supreme court', 'rti', 'gst', 'income tax',
    'contract act', 'will', 'succession', 'right to information', 'dowry', 'alimony', 'sexual harassment',
    'motor vehicles act', 'accident claim', 'marriage registration', 'police complaint',
    'traffic challan', 'environment law', 'section 420', 'sc/st act', 'ndps act', 'property dispute',
    'it act', 'medical negligence', 'evidence', 'probation', 'juvenile justice', 'company law',
    'labour law', 'maintenance claim', 'consumer forum', 'builder fraud', 'employment law',
    'startups act', 'posh', 'cyber law', 'media law', 'censorship', 'nhrc', 'nclt', 'pmla', 'it rules', 'beats', 'fraud','rape','restrict'
    'molest','forecefully','educate','study','traffic','consequences','ipc', 'crpc', 'cpc', 'indian constitution', 'contract act', 'consumer protection act', 'hindu marriage act', 'muslim personal law',
    'property act', 'transfer of property act', 'legal notice', 'legal advice', 'legal rights', 'legal remedy', 'legal help', 'legal support',
    'advocate', 'lawyer', 'attorney', 'counsel', 'jurisdiction', 'high court', 'supreme court', 'district court', 'magistrate',
    'judgment', 'sentence', 'verdict', 'witness', 'affidavit', 'petition', 'appeal', 'bail', 'fir', 'complaint', 'litigation', 'prosecution',
    'defense', 'evidence', 'testimony', 'lawsuit', 'plaintiff', 'respondent', 'appellant', 'tribunal', 'arbitration', 'mediation',
    'conciliation', 'hearing', 'trial', 'charge sheet', 'summons', 'warrant', 'cross examination', 'criminal case', 'civil case',
    'family court', 'maintenance', 'child custody', 'divorce', 'alimony', 'dowry', '498a', 'section 377', 'section 144', 'public nuisance',
    'trespassing', 'assault', 'theft', 'robbery', 'murder', 'homicide', 'rape', 'sexual harassment', 'molestation', 'domestic violence',
    'harassment', 'defamation', 'slander', 'libel', 'cyber law', 'cyber crime', 'it act', 'section 66a', 'privacy', 'data protection',
    'right to information', 'rti', 'right to education', 'article 14', 'article 19', 'article 21', 'equality before law', 'natural justice',
    'human rights', 'labour law', 'wages', 'minimum wages', 'bonus', 'gratuity', 'employment law', 'contractor', 'agreement',
    'lease agreement', 'rental agreement', 'property dispute', 'mutation', 'encroachment', 'land acquisition', 'revenue record',
    'succession', 'will', 'probate', 'inheritance', 'partition', 'family settlement', 'cheque bounce', 'ni act', 'negotiable instruments',
    'section 138', 'bankruptcy', 'insolvency', 'company law', 'corporate law', 'mca', 'roc', 'gst', 'income tax', 'tax evasion',
    'property tax', 'court fee', 'stamp duty', 'notary', 'registration act', 'marriage registration', 'court marriage', 'special marriage act',
    'religious conversion', 'sc/st act', 'caste discrimination', 'dowry prohibition act', 'pocso', 'juvenile justice act', 'motor vehicles act',
    'accident claim', 'insurance claim', 'compensation', 'legal heir certificate', 'death certificate', 'birth certificate', 'aadhar',
    'pan card', 'voter id', 'passport', 'driving license', 'citizenship', 'visa', 'immigration', 'foreigners act', 'nrc', 'npr',
    'section 420', 'cheating', 'fraud', 'bribery', 'corruption', 'lokpal', 'public servant', 'official secrets act', 'sedition', 'unlawful activity',
    'terrorism', 'narcotics', 'ndps act', 'smuggling', 'money laundering', 'pmla', 'income disclosure', 'benami property', 'black money',
    'hawala', 'financial scam', 'scam', 'ponzi scheme', 'sebi', 'stock fraud', 'insider trading', 'shareholder rights', 'trademark',
    'patent', 'copyright', 'intellectual property', 'ipr', 'it rules', 'media law', 'defamation law', 'press freedom', 'freedom of speech',
    'censorship', 'telecom law', 'internet shutdown', 'freedom of religion', 'freedom of assembly', 'sedition law', 'law commission',
    'judicial review', 'constitutional amendment', 'basic structure', 'president rule', 'governor powers', 'chief minister powers',
    'mla disqualification', 'mp disqualification', 'pmla act', 'ed inquiry', 'cbi', 'ncb', 'cvc', 'cag', 'lokayukta', 'nhrc',
    'minority rights', 'child rights', 'women rights', 'transgender rights', 'environment law', 'pollution control', 'eia', 'forest act',
    'wildlife act', 'water act', 'air act', 'national green tribunal', 'ngt', 'climate justice', 'labour tribunal', 'industrial dispute',
    'layoff', 'retrenchment', 'strike', 'lockout', 'employment contract', 'posh', 'sexual harassment', 'workplace law', 'service rules',
    'government job', 'reservation', 'sc st obc', 'ews quota', 'ncl', 'uplifting schemes', 'legal aid', 'free legal help', 'public interest litigation',
    'pil', 'habeas corpus', 'mandamus', 'certiorari', 'quo warranto', 'injunction', 'interim relief', 'stay order', 'contempt of court',
    'perjury', 'legal ethics', 'bar council', 'advocate act', 'judicial magistrate', 'sessions court', 'fast track court', 'virtual court',
    'e-courts', 'case status', 'court order', 'judicial custody', 'police remand', 'bailable offence', 'non-bailable offence',
    'compoundable offence', 'non-compoundable offence', 'punishment', 'fine', 'penalty', 'plea bargaining', 'parole', 'probation',
    'juvenile', 'child in conflict', 'adoption law', 'surrogacy law', 'medical negligence', 'consumer forum', 'district consumer court',
    'state commission', 'national commission', 'real estate law', 'rera', 'builder fraud', 'flat possession', 'construction delay',
    'agreement to sale', 'sale deed', 'title deed', 'encumbrance', 'mortgage', 'loan default', 'recovery', 'bank notice',
    'arbitration clause', 'jurisdiction clause', 'nda', 'mou', 'terms and conditions', 'privacy policy', 'data breach', 'cyber bullying',
    'phishing', 'sc/st atrocities', 'minority commission', 'family law', 'religious law', 'bigamy', 'maintenance claim', 'police complaint',
    'cyber cell', 'legal rights of students', 'ragging law', 'ugc guidelines', 'medical council', 'bar council rules', 'traffic challan',
    'over speeding', 'drunk driving', 'helmet rule', 'seatbelt rule', 'pollution under control', 'vehicle registration', 'rc book',
    'insurance policy', 'vehicle seizure', 'traffic e-challan', 'smart city law', 'digital evidence', 'cctv', 'forensic evidence',
    'dna test', 'lie detector', 'narco test', 'landmark judgment', 'constitutional bench', '5 judge bench', '7 judge bench',
    'case citation', 'legal database', 'manupatra', 'scc online', 'indiankanoon', 'bare act', 'legal glossary', 'case diary',
    'police investigation', 'chargesheet', 'remand report', 'court summons', 'witness protection', 'legal compliance', 'contract breach',
    'fiduciary duty', 'share transfer', 'board resolution', 'agm', 'egm', 'board of directors', 'company incorporation', 'startups act',
    'msme', 'bankruptcy code', 'ibc', 'nclt', 'nclat', 'tribunal judgement', 'case hearing date', 'court hall number', 'file inspection','marital','affairs','affair'
    'education','rights','ragging','assault','hello','hii','namaste','buddy','friend','how','depression','depressed','sad'
    ]
    
    # Hindi legal terms
    hindi_legal_terms = [
        'कानून', 'न्यायालय', 'वकील', 'न्यायाधीश', 'मुकदमा', 'अपील', 'जमानत',
        'तलाक', 'संपत्ति', 'अधिकार', 'कर्तव्य', 'दंड', 'जुर्माना', 'क्षतिपूर्ति',
        'आईपीसी', 'सीआरपीसी', 'सीपीसी', 'संविधान', 'धारा', 'अनुच्छेद',
        'पुलिस', 'अदालत', 'मजिस्ट्रेट', 'सेशन', 'सुप्रीम', 'हाई कोर्ट',
        'उपभोक्ता', 'संरक्षण', 'श्रम', 'रोजगार', 'कर', 'जीएसटी',
        'आयकर', 'संपत्ति कर', 'संपत्ति कर', 'पंजीकरण', 'स्टाम्प शुल्क', 'विरासत',
        'वसीयत', 'उत्तराधिकार', 'भरण-पोषण', 'गुजारा भत्ता', 'हिरासत',
        'गोद लेना', 'दहेज', 'उत्पीड़न', 'हमला', 'चोरी', 'धोखाधड़ी',
        'बेईमानी', 'मानहानि', 'अतिक्रमण', 'उपद्रव', 'मध्यस्थता',
        'मध्यस्थता', 'समझौता', 'निषेधाज्ञा', 'स्थगन', 'अपील',
        'संशोधन', 'रिट', 'बंदी प्रत्यक्षीकरण', 'परमादेश', 'उत्प्रेषण',
        'प्रतिषेध', 'अधिकार पृच्छा', 'मौलिक अधिकार', 'निदेशक सिद्धांत'
    ]
    
    # Check for any legal keyword
    all_keywords = basic_legal_keywords + hindi_legal_terms
    
    # More lenient matching - if any keyword is found, consider it legal
    for keyword in all_keywords:
        if keyword in query_lower:
            return True
    
    # Check for common legal phrases
    legal_phrases = [
        'what is section', 'section of', 'article of', 'under which act',
        'legal procedure', 'how to file', 'what are my rights', 'legal advice',
        'court case', 'legal help', 'indian law', 'legal matter',
        'क्या है धारा', 'धारा का', 'अनुच्छेद का', 'किस अधिनियम के तहत',
        'कानूनी प्रक्रिया', 'कैसे दाखिल करें', 'मेरे क्या अधिकार हैं', 'कानूनी सलाह',
        'अदालती मामला', 'कानूनी मदद', 'भारतीय कानून', 'कानूनी मामला'
    ]
    
    for phrase in legal_phrases:
        if phrase in query_lower:
            return True
    
    # If no legal keywords found, it's likely not a legal query
    return False

# Routes
@app.route('/')
def home():
    """Serve the main application"""
    return render_template('index.html')

@app.route('/chat')
def chat():
    """Serve the chat page"""
    return render_template('chat.html')

@app.route('/legal-areas')
def legal_areas():
    """Serve the legal areas page"""
    return render_template('legal_areas.html')

@app.route('/documents')
def documents():
    """Serve the documents page"""
    return render_template('documents.html')

@app.route('/cases')
def cases():
    """Serve the cases page"""
    return render_template('cases.html')

@app.route('/privacy')
def privacy():
    """Serve the privacy page"""
    return render_template('privacy.html')

@app.route('/debug')
def debug_console():
    """Debug console for troubleshooting the application"""
    return render_template('debug.html')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        data = request.get_json()
        message = data.get('message', '')  # Get single message instead of messages array
        session_id = data.get('session_id', str(uuid.uuid4()))
        language = data.get('language', 'english')  # Get language preference
        
        print(f"📝 Received message: '{message[:50]}...' (session: {session_id}, language: {language})")

        # Check if Groq client is initialized
        if client is None:
            print("❌ Groq client not initialized")
            return jsonify({
                'response': "Sorry, the AI service is currently unavailable. Please try again later.",
                'session_id': session_id,
                'error': "Groq client initialization failed",
                'timestamp': datetime.now().isoformat()
            }), 503

        # Skip validation for testing purposes
        DEBUG_MODE = True  # Set to False in production
        
        if not DEBUG_MODE:
            # Validate if query is legal-related
            is_legal, category, confidence = validator.is_legal_query(message)
            if not is_legal:
                print(f"⚠️ Non-legal query rejected: '{message[:50]}...'")
                return jsonify({
                    'response': "⚖️ LegalMitra only answers questions about Indian law. Please rephrase your query to include a legal context.",
                    'session_id': session_id,
                    'timestamp': datetime.now().isoformat()
                })

        # Initialize session if it doesn't exist
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []

        # Add user message to session
        chat_sessions[session_id].append({
            "role": "user",
            "content": message
        })

        # Prepare system prompt based on language
        system_content = (
            "आप LegalMitra हैं, एक AI कानूनी सहायक जो केवल भारतीय कानूनों में विशेषज्ञ है। हमेशा निम्नलिखित प्रारूप में उत्तर दें:\n"
            "1. मुख्य उत्तर\n"
            "2. **लागू धाराएं:** (यदि कोई हो)\n"
            "3. **आवश्यक दस्तावेज:** (यदि कोई हो)\n"
            "4. **समयसीमा:** (यदि लागू हो)\n"
            "5. **अस्वीकरण:** यह सामान्य कानूनी जानकारी है, विशिष्ट कानूनी सलाह नहीं। कृपया योग्य वकील से सलाह लें।"
            if language == "hindi" else
            "You are LegalMitra, an AI legal assistant specializing ONLY in Indian laws. Always structure your responses:\n"
            "1. Main answer\n"
            "2. **Applicable Sections:** (if any)\n"
            "3. **Required Documents:** (if any)\n"
            "4. **Timeline:** (if applicable)\n"
            "5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."
        )

        # Prepare messages for API call
        messages = [{"role": "system", "content": system_content}]
        messages.extend(chat_sessions[session_id])
        
        print(f"🔄 Calling Groq API with {len(messages)} messages...")
        
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=1000,
            )
            
            ai_response = chat_completion.choices[0].message.content
            print(f"✅ Received response from Groq API: '{ai_response[:50]}...'")

            # Add assistant response to session
            chat_sessions[session_id].append({
                "role": "assistant",
                "content": ai_response
            })

            return jsonify({
                'response': ai_response,
                'session_id': session_id,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as api_error:
            print(f"❌ Groq API error: {str(api_error)}")
            return jsonify({
                'response': f"Sorry, I encountered an error while processing your request: {str(api_error)}. Please try again.",
                'session_id': session_id,
                'error': str(api_error),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        print(f"❌ General error in chat_api: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': "An unexpected error occurred. Please try again."
        }), 500

def call_groq_api(message, language='english'):
    """Call Groq API for legal responses"""
    try:
        if GROQ_API_KEY == 'your_groq_api_key_here':
            return jsonify({
                "response": "Please configure your Groq API key in the environment variables to get AI responses."
            })
        
        # Prepare system prompt
        system_prompt = (
            "आप LegalMitra हैं, एक AI कानूनी सहायक जो केवल भारतीय कानूनों में विशेषज्ञ है। हमेशा निम्नलिखित प्रारूप में उत्तर दें:\n"
            "1. मुख्य उत्तर\n"
            "2. **लागू धाराएं:** (यदि कोई हो)\n"
            "3. **आवश्यक दस्तावेज:** (यदि कोई हो)\n"
            "4. **समयसीमा:** (यदि लागू हो)\n"
            "5. **अस्वीकरण:** यह सामान्य कानूनी जानकारी है, विशिष्ट कानूनी सलाह नहीं। कृपया योग्य वकील से सलाह लें।"
            if language == "hindi" else
            "You are LegalMitra, an AI legal assistant specializing ONLY in Indian laws. Always structure your responses:\n"
            "1. Main answer\n"
            "2. **Applicable Sections:** (if any)\n"
            "3. **Required Documents:** (if any)\n"
            "4. **Timeline:** (if applicable)\n"
            "5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."
        )
        
        # Call Groq API
        headers = {
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': message}
            ],
            'model': 'llama3-8b-8192',
            'temperature': 0.2,
            'max_tokens': 1000
        }
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result['choices'][0]['message']['content']
            return jsonify({"response": ai_response})
        else:
            logger.error(f"Groq API error: {response.status_code} - {response.text}")
            return jsonify({"response": "Sorry, I'm having trouble connecting to the AI service right now."})
            
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return jsonify({"response": "Sorry, there was an error processing your request."})

@app.route('/api/validate-legal-query', methods=['POST'])
def validate_legal_query():
    try:
        data = request.get_json()
        query = data.get('query', '')
        is_legal, category, confidence = is_legal_query(query)

        return jsonify({
            "is_legal": is_legal,
            "category": category,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error validating query: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/quick-question', methods=['POST'])
def quick_question():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        print(f"📝 Received quick question: '{question[:50]}...'")

        # Check if Groq client is initialized
        if client is None:
            print("❌ Groq client not initialized")
            return jsonify({
                'response': "Sorry, the AI service is currently unavailable. Please try again later.",
                'error': "Groq client initialization failed",
                'timestamp': datetime.now().isoformat()
            }), 503

        # ❗ Reject non-legal queries
        is_legal, category, confidence = validator.is_legal_query(question)
        if not is_legal:
            print(f"⚠️ Non-legal query rejected: '{question[:50]}...'")
            return jsonify({
                'response': "⚖️ LegalMitra only answers questions about Indian law. Please rephrase your query to include a legal context."
            })

        print(f"🔄 Calling Groq API for quick question...")
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": question}
                ],
                model="llama3-8b-8192",  # Changed to match the model used in chat_api
                temperature=0.7,
                max_tokens=1000,
            )
            
            ai_response = chat_completion.choices[0].message.content
            print(f"✅ Received response from Groq API: '{ai_response[:50]}...'")

            return jsonify({
                'response': ai_response,
                'question': question,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as api_error:
            print(f"❌ Groq API error: {str(api_error)}")
            return jsonify({
                'response': f"Sorry, I encountered an error while processing your request: {str(api_error)}. Please try again.",
                'error': str(api_error),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        print(f"❌ General error in quick_question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Check if Groq client is initialized
        groq_status = "available" if client is not None else "unavailable"
        
        return jsonify({
            'status': 'ok',
            'groq_status': groq_status,
            'timestamp': datetime.now().isoformat(),
            'sessions_count': len(chat_sessions)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Create templates and static directories
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print("🚀 Starting LegalMitra AI Server...")
    print(f"📝 System prompt length: {len(SYSTEM_PROMPT)} characters")
    print(f"🔑 Groq API key: {'Configured' if client is not None else 'Not configured or invalid'}")
    print(f"🔍 Legal keywords count: {len(LEGAL_KEYWORDS)}")
    print("⚖️ LegalMitra is ready to provide legal assistance!")
    app.run(debug=True, host='0.0.0.0', port=5000)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Get Groq API key from environment
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', 'your_groq_api_key_here')

# Initialize Groq client with your API key
try:
    client = Groq(api_key="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")
    print("✅ Groq client initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Groq client: {str(e)}")
    client = None

class LegalValidator:
    """Validates if queries are legal-related and processes them accordingly"""
    
    def __init__(self):
        # Legal keywords and patterns
        self.legal_keywords = {
            'laws': ['ipc', 'crpc', 'cpc', 'constitution', 'act', 'section', 'article', 'law', 'legal', 'court', 'judge'],
            'legal_areas': ['criminal', 'civil', 'property', 'family', 'consumer', 'labour', 'corporate', 'tax', 'constitutional'],
            'legal_actions': ['file', 'case', 'petition', 'appeal', 'bail', 'divorce', 'registration', 'complaint', 'fir'],
            'legal_entities': ['lawyer', 'advocate', 'attorney', 'court', 'tribunal', 'police', 'magistrate', 'judge'],
            'legal_documents': ['contract', 'agreement', 'will', 'deed', 'affidavit', 'notice', 'summons', 'warrant'],
            'rights_duties': ['rights', 'duties', 'obligations', 'liability', 'compensation', 'damages', 'penalty']
        }
        
        # Hindi legal terms
        self.hindi_legal_terms = [
            'कानून', 'न्यायालय', 'वकील', 'न्यायाधीश', 'मुकदमा', 'अपील', 'जमानत', 
            'तलाक', 'संपत्ति', 'अधिकार', 'कर्तव्य', 'दंड', 'जुर्माना', 'क्षतिपूर्ति',
            'आईपीसी', 'सीआरपीसी', 'सीपीसी', 'संविधान', 'धारा', 'अनुच्छेद'
        ]
        
        # Non-legal patterns to reject
        self.non_legal_patterns = [
            r'\b(weather|sports|cooking|music|movies|games|entertainment)\b',
            r'\b(programming|coding|software|technology|computer)\b',
            r'\b(health|medical|doctor|medicine|disease)\b',
            r'\b(travel|tourism|vacation|holiday)\b',
            r'\b(food|recipe|restaurant|cuisine)\b'
        ]
    
    def is_legal_query(self, query):
        """Determines if a query is legal-related"""
        query_lower = query.lower()
        
        # Check for non-legal patterns first
        for pattern in self.non_legal_patterns:
            if re.search(pattern, query_lower, re.IGNORECASE):
                return False, "non_legal", 0.0
        
        legal_score = 0
        total_words = len(query.split())
        matched_categories = []
        
        # Check English legal terms
        for category, keywords in self.legal_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in query_lower)
            if matches > 0:
                legal_score += matches
                matched_categories.append(category)
        
        # Check Hindi legal terms
        hindi_matches = sum(1 for term in self.hindi_legal_terms if term in query)
        if hindi_matches > 0:
            legal_score += hindi_matches * 2
            matched_categories.append('hindi_legal')
        
        # Calculate confidence score
        confidence = min(legal_score / max(total_words, 1.0), 1.0)
        
        # Determine if it's legal (threshold: 0.1)
        is_legal = confidence >= 0.1 or any(cat in matched_categories for cat in ['laws', 'legal_areas', 'legal_actions'])
        
        primary_category = matched_categories[0] if matched_categories else "general_legal"
        
        return is_legal, primary_category, confidence

class LegalKnowledgeBase:
    """Comprehensive legal knowledge base for Indian laws"""
    
    def __init__(self):
        self.ipc_sections = {
            "302": {
                "title": "Punishment for murder",
                "description": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
                "punishment": "Death or life imprisonment + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Sessions Court"
            },
            "420": {
                "title": "Cheating and dishonestly inducing delivery of property",
                "description": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
                "punishment": "Imprisonment up to 7 years + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Magistrate"
            },
            "498A": {
                "title": "Husband or relative of husband of a woman subjecting her to cruelty",
                "description": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
                "punishment": "Imprisonment up to 3 years + fine",
                "bailable": False,
                "cognizable": True,
                "court": "Magistrate"
            }
        }
        
        self.constitutional_articles = {
            "21": {
                "title": "Protection of life and personal liberty",
                "description": "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
                "fundamental_right": True,
                "category": "Right to Life and Liberty"
            },
            "14": {
                "title": "Equality before law",
                "description": "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
                "fundamental_right": True,
                "category": "Right to Equality"
            },
            "19": {
                "title": "Protection of certain rights regarding freedom of speech etc.",
                "description": "All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout the territory of India, to reside and settle in any part of the territory of India, and to practise any profession, or to carry on any occupation, trade or business.",
                "fundamental_right": True,
                "category": "Right to Freedom"
            }
        }
    
    def get_section_info(self, section, act="ipc"):
        """Get information about a specific legal section"""
        if act.lower() == "ipc" and section in self.ipc_sections:
            return self.ipc_sections[section]
        return None
    
    def get_article_info(self, article):
        """Get information about a constitutional article"""
        return self.constitutional_articles.get(article)

# Initialize components
validator = LegalValidator()
knowledge_base = LegalKnowledgeBase()

# Define system prompt and legal keywords
SYSTEM_PROMPT = """You are LegalMitra, an AI legal assistant specializing in Indian law. Provide accurate and helpful information about Indian legal topics. Always structure your responses clearly and concisely.

1. Main answer
2. **Applicable Sections:** (if any)
3. **Required Documents:** (if any)
4. **Timeline:** (if applicable)
5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."""

LEGAL_KEYWORDS = [
    'law', 'legal', 'court', 'judge', 'ipc', 'crpc', 'cpc', 'constitution', 
    'section', 'article', 'property', 'family', 'criminal', 'civil'
]

# Chat sessions
chat_sessions = {}

def is_legal_query(query):
    """Enhanced check to determine if a query is legal-related"""
    query_lower = query.lower()
    
    # Basic legal keywords - made more comprehensive
    basic_legal_keywords = [
        'law', 'legal', 'court', 'judge', 'ipc', 'crpc', 'cpc', 'constitution', 
        'section', 'article', 'property', 'family', 'criminal', 'civil',
        'rights', 'lawyer', 'advocate', 'case', 'petition', 'bail', 'fir',
        'divorce', 'marriage', 'contract', 'agreement', 'police', 'crime',
        'punishment', 'fine', 'penalty', 'compensation', 'damages', 'liability',
        'tribunal', 'magistrate', 'sessions', 'supreme', 'high court',
        'consumer', 'protection', 'labour', 'employment', 'tax', 'gst',
        'income tax', 'property tax', 'registration', 'stamp duty',
        'inheritance', 'will', 'succession', 'maintenance', 'alimony',
        'custody', 'adoption', 'dowry', 'harassment', 'assault', 'theft',
        'fraud', 'cheating', 'defamation', 'trespass', 'nuisance',
        'arbitration', 'mediation', 'settlement', 'injunction', 'stay',
        'appeal', 'revision', 'writ', 'habeas corpus', 'mandamus',
        'certiorari', 'prohibition', 'quo warranto', 'fundamental rights',
        'directive principles', 'amendment', 'ordinance', 'notification',
        'gazette', 'act', 'rule', 'regulation', 'bye-law', 'order'
    ]
    
    # Hindi legal terms
    hindi_legal_terms = [
        'कानून', 'न्यायालय', 'वकील', 'न्यायाधीश', 'मुकदमा', 'अपील', 'जमानत',
        'तलाक', 'संपत्ति', 'अधिकार', 'कर्तव्य', 'दंड', 'जुर्माना', 'क्षतिपूर्ति',
        'आईपीसी', 'सीआरपीसी', 'सीपीसी', 'संविधान', 'धारा', 'अनुच्छेद',
        'पुलिस', 'अदालत', 'मजिस्ट्रेट', 'सेशन', 'सुप्रीम', 'हाई कोर्ट',
        'उपभोक्ता', 'संरक्षण', 'श्रम', 'रोजगार', 'कर', 'जीएसटी',
        'आयकर', 'संपत्ति कर', 'संपत्ति कर', 'पंजीकरण', 'स्टाम्प शुल्क', 'विरासत',
        'वसीयत', 'उत्तराधिकार', 'भरण-पोषण', 'गुजारा भत्ता', 'हिरासत',
        'गोद लेना', 'दहेज', 'उत्पीड़न', 'हमला', 'चोरी', 'धोखाधड़ी',
        'बेईमानी', 'मानहानि', 'अतिक्रमण', 'उपद्रव', 'मध्यस्थता',
        'मध्यस्थता', 'समझौता', 'निषेधाज्ञा', 'स्थगन', 'अपील',
        'संशोधन', 'रिट', 'बंदी प्रत्यक्षीकरण', 'परमादेश', 'उत्प्रेषण',
        'प्रतिषेध', 'अधिकार पृच्छा', 'मौलिक अधिकार', 'निदेशक सिद्धांत'
    ]
    
    # Check for any legal keyword
    all_keywords = basic_legal_keywords + hindi_legal_terms
    
    # More lenient matching - if any keyword is found, consider it legal
    for keyword in all_keywords:
        if keyword in query_lower:
            return True
    
    # Check for common legal phrases
    legal_phrases = [
        'what is section', 'section of', 'article of', 'under which act',
        'legal procedure', 'how to file', 'what are my rights', 'legal advice',
        'court case', 'legal help', 'indian law', 'legal matter',
        'क्या है धारा', 'धारा का', 'अनुच्छेद का', 'किस अधिनियम के तहत',
        'कानूनी प्रक्रिया', 'कैसे दाखिल करें', 'मेरे क्या अधिकार हैं', 'कानूनी सलाह',
        'अदालती मामला', 'कानूनी मदद', 'भारतीय कानून', 'कानूनी मामला'
    ]
    
    for phrase in legal_phrases:
        if phrase in query_lower:
            return True
    
    # If no legal keywords found, it's likely not a legal query
    return False

# Routes
@app.route('/')
def home():
    """Serve the main application"""
    return render_template('index.html')

@app.route('/chat')
def chat():
    """Serve the chat page"""
    return render_template('chat.html')

@app.route('/legal-areas')
def legal_areas():
    """Serve the legal areas page"""
    return render_template('legal_areas.html')

@app.route('/documents')
def documents():
    """Serve the documents page"""
    return render_template('documents.html')

@app.route('/cases')
def cases():
    """Serve the cases page"""
    return render_template('cases.html')

@app.route('/privacy')
def privacy():
    """Serve the privacy page"""
    return render_template('privacy.html')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        data = request.get_json()
        message = data.get('message', '')  # Get single message instead of messages array
        session_id = data.get('session_id', str(uuid.uuid4()))
        language = data.get('language', 'english')  # Get language preference
        
        print(f"📝 Received message: '{message[:50]}...' (session: {session_id}, language: {language})")

        # Check if Groq client is initialized
        if client is None:
            print("❌ Groq client not initialized")
            return jsonify({
                'response': "Sorry, the AI service is currently unavailable. Please try again later.",
                'session_id': session_id,
                'error': "Groq client initialization failed",
                'timestamp': datetime.now().isoformat()
            }), 503

        # Skip validation for testing purposes
        DEBUG_MODE = True  # Set to False in production
        
        if not DEBUG_MODE:
            # Validate if query is legal-related
            is_legal, category, confidence = validator.is_legal_query(message)
            if not is_legal:
                print(f"⚠️ Non-legal query rejected: '{message[:50]}...'")
                return jsonify({
                    'response': "⚖️ LegalMitra only answers questions about Indian law. Please rephrase your query to include a legal context.",
                    'session_id': session_id,
                    'timestamp': datetime.now().isoformat()
                })

        # Initialize session if it doesn't exist
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []

        # Add user message to session
        chat_sessions[session_id].append({
            "role": "user",
            "content": message
        })

        # Prepare system prompt based on language
        system_content = (
            "आप LegalMitra हैं, एक AI कानूनी सहायक जो केवल भारतीय कानूनों में विशेषज्ञ है। हमेशा निम्नलिखित प्रारूप में उत्तर दें:\n"
            "1. मुख्य उत्तर\n"
            "2. **लागू धाराएं:** (यदि कोई हो)\n"
            "3. **आवश्यक दस्तावेज:** (यदि कोई हो)\n"
            "4. **समयसीमा:** (यदि लागू हो)\n"
            "5. **अस्वीकरण:** यह सामान्य कानूनी जानकारी है, विशिष्ट कानूनी सलाह नहीं। कृपया योग्य वकील से सलाह लें।"
            if language == "hindi" else
            "You are LegalMitra, an AI legal assistant specializing ONLY in Indian laws. Always structure your responses:\n"
            "1. Main answer\n"
            "2. **Applicable Sections:** (if any)\n"
            "3. **Required Documents:** (if any)\n"
            "4. **Timeline:** (if applicable)\n"
            "5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."
        )

        # Prepare messages for API call
        messages = [{"role": "system", "content": system_content}]
        messages.extend(chat_sessions[session_id])
        
        print(f"🔄 Calling Groq API with {len(messages)} messages...")
        
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=1000,
            )
            
            ai_response = chat_completion.choices[0].message.content
            print(f"✅ Received response from Groq API: '{ai_response[:50]}...'")

            # Add assistant response to session
            chat_sessions[session_id].append({
                "role": "assistant",
                "content": ai_response
            })

            return jsonify({
                'response': ai_response,
                'session_id': session_id,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as api_error:
            print(f"❌ Groq API error: {str(api_error)}")
            return jsonify({
                'response': f"Sorry, I encountered an error while processing your request: {str(api_error)}. Please try again.",
                'session_id': session_id,
                'error': str(api_error),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        print(f"❌ General error in chat_api: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': "An unexpected error occurred. Please try again."
        }), 500

def call_groq_api(message, language='english'):
    """Call Groq API for legal responses"""
    try:
        if GROQ_API_KEY == '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':
            return jsonify({
                "response": "Please configure your Groq API key in the environment variables to get AI responses."
            })
        
        # Prepare system prompt
        system_prompt = (
            "आप LegalMitra हैं, एक AI कानूनी सहायक जो केवल भारतीय कानूनों में विशेषज्ञ है। हमेशा निम्नलिखित प्रारूप में उत्तर दें:\n"
            "1. मुख्य उत्तर\n"
            "2. **लागू धाराएं:** (यदि कोई हो)\n"
            "3. **आवश्यक दस्तावेज:** (यदि कोई हो)\n"
            "4. **समयसीमा:** (यदि लागू हो)\n"
            "5. **अस्वीकरण:** यह सामान्य कानूनी जानकारी है, विशिष्ट कानूनी सलाह नहीं। कृपया योग्य वकील से सलाह लें।"
            if language == "hindi" else
            "You are LegalMitra, an AI legal assistant specializing ONLY in Indian laws. Always structure your responses:\n"
            "1. Main answer\n"
            "2. **Applicable Sections:** (if any)\n"
            "3. **Required Documents:** (if any)\n"
            "4. **Timeline:** (if applicable)\n"
            "5. **Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."
        )
        
        # Call Groq API
        headers = {
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': message}
            ],
            'model': 'llama3-8b-8192',
            'temperature': 0.2,
            'max_tokens': 1000
        }
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result['choices'][0]['message']['content']
            return jsonify({"response": ai_response})
        else:
            logger.error(f"Groq API error: {response.status_code} - {response.text}")
            return jsonify({"response": "Sorry, I'm having trouble connecting to the AI service right now."})
            
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return jsonify({"response": "Sorry, there was an error processing your request."})

@app.route('/api/validate-legal-query', methods=['POST'])
def validate_legal_query():
    """Validate if a query is legal-related"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        is_legal, category, confidence = is_legal_query(query)
        
        return jsonify({
            "is_legal": is_legal,
            "category": category,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error validating query: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/quick-question', methods=['POST'])
def quick_question():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        print(f"📝 Received quick question: '{question[:50]}...'")

        # Check if Groq client is initialized
        if client is None:
            print("❌ Groq client not initialized")
            return jsonify({
                'response': "Sorry, the AI service is currently unavailable. Please try again later.",
                'error': "Groq client initialization failed",
                'timestamp': datetime.now().isoformat()
            }), 503

        # ❗ Reject non-legal queries
        is_legal, category, confidence = validator.is_legal_query(question)
        if not is_legal:
            print(f"⚠️ Non-legal query rejected: '{question[:50]}...'")
            return jsonify({
                'response': "⚖️ LegalMitra only answers questions about Indian law. Please rephrase your query to include a legal context."
            })

        print(f"🔄 Calling Groq API for quick question...")
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": question}
                ],
                model="llama3-8b-8192",  # Changed to match the model used in chat_api
                temperature=0.7,
                max_tokens=1000,
            )
            
            ai_response = chat_completion.choices[0].message.content
            print(f"✅ Received response from Groq API: '{ai_response[:50]}...'")

            return jsonify({
                'response': ai_response,
                'question': question,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as api_error:
            print(f"❌ Groq API error: {str(api_error)}")
            return jsonify({
                'response': f"Sorry, I encountered an error while processing your request: {str(api_error)}. Please try again.",
                'error': str(api_error),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        print(f"❌ General error in quick_question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Check if Groq client is initialized
        groq_status = "available" if client is not None else "unavailable"
        
        return jsonify({
            'status': 'ok',
            'groq_status': groq_status,
            'timestamp': datetime.now().isoformat(),
            'sessions_count': len(chat_sessions)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Create templates and static directories
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print("🚀 Starting LegalMitra AI Server...")
    print(f"📝 System prompt length: {len(SYSTEM_PROMPT)} characters")
    print(f"🔑 Groq API key: {'Configured' if client is not None else 'Not configured or invalid'}")
    print(f"🔍 Legal keywords count: {len(LEGAL_KEYWORDS)}")
    print("⚖️ LegalMitra is ready to provide legal assistance!")
    app.run(debug=True, host='0.0.0.0', port=5000)
