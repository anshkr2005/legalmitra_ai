import re
import json
from typing import Dict, List, Tuple, Optional

class LegalQueryValidator:
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
    
    def is_legal_query(self, query: str) -> Tuple[bool, str, float]:
        """
        Determines if a query is legal-related
        Returns: (is_legal, category, confidence_score)
        """
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
            legal_score += hindi_matches * 2  # Give higher weight to Hindi terms
            matched_categories.append('hindi_legal')
        
        # Calculate confidence score
        confidence = min(legal_score / max(total_words, 1), 1.0)
        
        # Determine if it's legal (threshold: 0.1)
        is_legal = confidence >= 0.1 or any(cat in matched_categories for cat in ['laws', 'legal_areas', 'legal_actions'])
        
        primary_category = matched_categories[0] if matched_categories else "general_legal"
        
        return is_legal, primary_category, confidence
    
    def extract_legal_entities(self, query: str) -> Dict[str, List[str]]:
        """Extract legal entities from the query"""
        entities = {
            'sections': [],
            'acts': [],
            'articles': [],
            'courts': [],
            'legal_terms': []
        }
        
        # Extract IPC sections
        ipc_pattern = r'\b(?:section\s+)?(\d+[a-z]?)\s*(?:of\s+)?(?:ipc|indian\s+penal\s+code)\b'
        entities['sections'].extend(re.findall(ipc_pattern, query, re.IGNORECASE))
        
        # Extract articles
        article_pattern = r'\barticle\s+(\d+[a-z]?)\b'
        entities['articles'].extend(re.findall(article_pattern, query, re.IGNORECASE))
        
        # Extract acts
        act_pattern = r'\b([a-z\s]+)\s+act\b'
        entities['acts'].extend(re.findall(act_pattern, query, re.IGNORECASE))
        
        return entities
    
    def generate_legal_context(self, query: str, category: str) -> Dict[str, any]:
        """Generate context for legal processing"""
        entities = self.extract_legal_entities(query)
        
        context = {
            'query': query,
            'category': category,
            'entities': entities,
            'suggested_areas': [],
            'priority': 'medium'
        }
        
        # Determine priority based on keywords
        high_priority_terms = ['urgent', 'emergency', 'arrest', 'bail', 'custody', 'immediate']
        if any(term in query.lower() for term in high_priority_terms):
            context['priority'] = 'high'
        
        # Suggest related legal areas
        if 'criminal' in category or any(term in query.lower() for term in ['fir', 'police', 'arrest', 'bail']):
            context['suggested_areas'] = ['Criminal Law', 'Police Procedures', 'Bail Applications']
        elif 'property' in category or any(term in query.lower() for term in ['property', 'land', 'registration']):
            context['suggested_areas'] = ['Property Law', 'Registration Procedures', 'Land Records']
        elif 'family' in category or any(term in query.lower() for term in ['divorce', 'marriage', 'custody']):
            context['suggested_areas'] = ['Family Law', 'Matrimonial Disputes', 'Child Custody']
        
        return context

# Test the validator
validator = LegalQueryValidator()

# Test cases
test_queries = [
    "How to file an FIR?",
    "What is Section 420 of IPC?",
    "Property registration process in India",
    "What's the weather today?",
    "भारत में तलाक की प्रक्रिया क्या है?",
    "Consumer protection rights",
    "How to cook pasta?",
    "Article 21 of Constitution",
    "Labour law violations"
]

print("Legal Query Validation Results:")
print("=" * 50)

for query in test_queries:
    is_legal, category, confidence = validator.is_legal_query(query)
    print(f"Query: {query}")
    print(f"Legal: {is_legal} | Category: {category} | Confidence: {confidence:.2f}")
    
    if is_legal:
        context = validator.generate_legal_context(query, category)
        print(f"Context: {json.dumps(context, indent=2, ensure_ascii=False)}")
    
    print("-" * 30)
