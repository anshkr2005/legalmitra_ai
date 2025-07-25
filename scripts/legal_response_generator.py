import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime

class LegalResponseGenerator:
    """Generates structured legal responses with proper formatting"""
    
    def __init__(self, knowledge_base, validator):
        self.kb = knowledge_base
        self.validator = validator
        self.response_templates = self._load_response_templates()
    
    def _load_response_templates(self) -> Dict[str, str]:
        """Load response templates for different legal categories"""
        return {
            "section_info": """
**{section_type} {section_number}: {title}**

{description}

**Applicable Sections:** {section_type} {section_number}

**Required Documents:** {documents}

**Timeline:** {timeline}

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation.
            """,
            
            "procedure_info": """
**{procedure_title}**

{description}

**Steps to Follow:**
{steps}

**Required Documents:** {documents}

**Timeline:** {timeline}

**Legal Basis:** {legal_basis}

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation.
            """,
            
            "general_legal": """
{main_answer}

**Applicable Sections:** {sections}

**Required Documents:** {documents}

**Timeline:** {timeline}

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation.
            """,
            
            "non_legal_rejection": """
I'm sorry, but I can only assist with legal matters related to Indian law. Your question appears to be about {detected_topic}.

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

Please ask me a legal question, and I'll be happy to help!
            """
        }
    
    def generate_response(self, query: str, language: str = "english") -> Dict[str, any]:
        """Generate a comprehensive legal response"""
        
        # Validate if query is legal
        is_legal, category, confidence = self.validator.is_legal_query(query)
        
        if not is_legal:
            return {
                "is_legal": False,
                "response": self.response_templates["non_legal_rejection"].format(
                    detected_topic=category.replace("_", " ")
                ),
                "category": category,
                "confidence": confidence
            }
        
        # Generate legal context
        context = self.validator.generate_legal_context(query, category)
        
        # Search knowledge base
        search_results = self.kb.search_legal_content(query)
        
        # Generate response based on query type
        response = self._generate_legal_response(query, context, search_results, language)
        
        return {
            "is_legal": True,
            "response": response,
            "category": category,
            "confidence": confidence,
            "context": context,
            "search_results": search_results
        }
    
    def _generate_legal_response(self, query: str, context: Dict, search_results: List, language: str) -> str:
        """Generate detailed legal response"""
        
        query_lower = query.lower()
        
        # Check for specific section queries
        if "section" in query_lower and any(num in query_lower for num in ["420", "302", "498a"]):
            return self._generate_section_response(query, context, search_results)
        
        # Check for article queries
        elif "article" in query_lower:
            return self._generate_article_response(query, context, search_results)
        
        # Check for procedure queries
        elif any(term in query_lower for term in ["how to", "process", "procedure", "file", "register"]):
            return self._generate_procedure_response(query, context, search_results)
        
        # General legal response
        else:
            return self._generate_general_response(query, context, search_results, language)
    
    def _generate_section_response(self, query: str, context: Dict, search_results: List) -> str:
        """Generate response for section-specific queries"""
        
        # Extract section number
        import re
        section_match = re.search(r'section\s+(\d+[a-z]?)', query.lower())
        if section_match:
            section_num = section_match.group(1)
            
            # Check if it's IPC section
            section_info = self.kb.get_section_info(section_num, "ipc")
            if section_info:
                return self.response_templates["section_info"].format(
                    section_type="IPC Section",
                    section_number=section_num,
                    title=section_info['title'],
                    description=section_info['description'],
                    documents="Identity proof, Evidence (if applicable), Witness statements",
                    timeline="Immediate reporting recommended" if section_info['cognizable'] else "As per court procedures"
                )
        
        # Fallback to search results
        if search_results:
            result = search_results[0]
            return f"**{result['reference']}: {result['title']}**\n\n{result['content']}\n\n**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."
        
        return "I couldn't find specific information about that section. Please provide more details or consult with a qualified lawyer."
    
    def _generate_article_response(self, query: str, context: Dict, search_results: List) -> str:
        """Generate response for constitutional article queries"""
        
        import re
        article_match = re.search(r'article\s+(\d+[a-z]?)', query.lower())
        if article_match:
            article_num = article_match.group(1)
            article_info = self.kb.get_article_info(article_num)
            
            if article_info:
                return f"""**Article {article_num}: {article_info['title']}**

{article_info['description']}

**Category:** {article_info['category']}
**Fundamental Right:** {'Yes' if article_info['fundamental_right'] else 'No'}

**Landmark Cases:** {', '.join(article_info.get('landmark_cases', []))}

**Applicable Sections:** Article {article_num} of the Constitution of India

**Required Documents:** Constitutional petition, Legal grounds, Supporting evidence

**Timeline:** As per court procedures

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."""
        
        return "I couldn't find specific information about that article. Please provide more details or consult with a qualified lawyer."
    
    def _generate_procedure_response(self, query: str, context: Dict, search_results: List) -> str:
        """Generate response for procedure queries"""
        
        query_lower = query.lower()
        
        # FIR filing procedure
        if "fir" in query_lower:
            proc_info = self.kb.get_procedure_info("fir_filing")
            if proc_info:
                steps_text = "\n".join([f"{i+1}. {step}" for i, step in enumerate(proc_info['steps'])])
                return self.response_templates["procedure_info"].format(
                    procedure_title=proc_info['title'],
                    description="First Information Report (FIR) is the first step in criminal proceedings.",
                    steps=steps_text,
                    documents=", ".join(proc_info['documents_required']),
                    timeline=proc_info['timeline'],
                    legal_basis=proc_info['legal_basis']
                )
        
        # Property registration
        elif "property" in query_lower and "registration" in query_lower:
            proc_info = self.kb.get_procedure_info("property_registration")
            if proc_info:
                steps_text = "\n".join([f"{i+1}. {step}" for i, step in enumerate(proc_info['steps'])])
                return self.response_templates["procedure_info"].format(
                    procedure_title=proc_info['title'],
                    description="Property registration is mandatory for legal ownership transfer.",
                    steps=steps_text,
                    documents=", ".join(proc_info['documents_required']),
                    timeline=proc_info['timeline'],
                    legal_basis=proc_info['legal_basis']
                )
        
        return "I can help you with various legal procedures. Please specify which procedure you need information about (e.g., FIR filing, property registration, divorce procedure, etc.)."
    
    def _generate_general_response(self, query: str, context: Dict, search_results: List, language: str) -> str:
        """Generate general legal response"""
        
        if search_results:
            main_result = search_results[0]
            additional_info = ""
            
            if len(search_results) > 1:
                additional_info = f"\n\n**Related Information:**\n"
                for result in search_results[1:3]:  # Show 2 more results
                    additional_info += f"- {result['reference']}: {result['title']}\n"
            
            return f"""**{main_result['title']}**

{main_result['content']}{additional_info}

**Applicable Sections:** {main_result.get('reference', 'Various applicable sections')}

**Required Documents:** Relevant documents as per the specific case

**Timeline:** Varies based on the specific legal matter

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."""
        
        # Fallback response
        return """I understand you have a legal query. To provide you with the most accurate information, please specify:

1. The specific legal area (Criminal, Civil, Property, Family, etc.)
2. The particular section or law you're asking about
3. Your specific situation or question

I can help with:
- Indian Penal Code (IPC) sections
- Criminal Procedure Code (CrPC)
- Constitutional articles
- Legal procedures and documentation
- Consumer protection rights
- Property law matters
- Family law issues

**Disclaimer:** This is general legal information, not specific legal advice. Please consult with a qualified lawyer for your specific situation."""

# Test the response generator
from legal_validator import LegalQueryValidator
from legal_knowledge_base import LegalKnowledgeBase

validator = LegalQueryValidator()
kb = LegalKnowledgeBase()
generator = LegalResponseGenerator(kb, validator)

# Test queries
test_queries = [
    "What is Section 420 of IPC?",
    "How to file an FIR?",
    "What's the weather today?",
    "Article 21 of Constitution",
    "Property registration process",
    "Consumer protection rights"
]

print("Legal Response Generation Test:")
print("=" * 50)

for query in test_queries:
    print(f"\nQuery: {query}")
    response_data = generator.generate_response(query, "english")
    print(f"Legal: {response_data['is_legal']}")
    print(f"Response:\n{response_data['response']}")
    print("-" * 30)
