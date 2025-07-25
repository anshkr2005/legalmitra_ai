import json
from typing import Dict, List, Optional
from datetime import datetime

class LegalKnowledgeBase:
    """Comprehensive legal knowledge base for Indian laws"""
    
    def __init__(self):
        self.ipc_sections = self._load_ipc_sections()
        self.crpc_sections = self._load_crpc_sections()
        self.constitutional_articles = self._load_constitutional_articles()
        self.legal_procedures = self._load_legal_procedures()
        self.document_templates = self._load_document_templates()
    
    def _load_ipc_sections(self) -> Dict[str, Dict]:
        """Load IPC sections database"""
        return {
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
    
    def _load_crpc_sections(self) -> Dict[str, Dict]:
        """Load CrPC sections database"""
        return {
            "154": {
                "title": "Information in cognizable cases",
                "description": "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant.",
                "procedure": "FIR registration procedure",
                "timeline": "Immediate",
                "documents_required": ["Identity proof", "Complaint details"]
            },
            "41": {
                "title": "When police may arrest without warrant",
                "description": "Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has been concerned in any cognizable offence or against whom a reasonable complaint has been made or credible information has been received.",
                "procedure": "Arrest without warrant",
                "timeline": "Immediate",
                "rights": ["Right to know grounds of arrest", "Right to legal aid", "Right to inform family"]
            }
        }
    
    def _load_constitutional_articles(self) -> Dict[str, Dict]:
        """Load Constitutional articles"""
        return {
            "21": {
                "title": "Protection of life and personal liberty",
                "description": "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
                "fundamental_right": True,
                "category": "Right to Life and Liberty",
                "landmark_cases": ["Maneka Gandhi v. Union of India", "Kharak Singh v. State of UP"]
            },
            "14": {
                "title": "Equality before law",
                "description": "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
                "fundamental_right": True,
                "category": "Right to Equality",
                "landmark_cases": ["State of West Bengal v. Anwar Ali Sarkar"]
            },
            "19": {
                "title": "Protection of certain rights regarding freedom of speech etc.",
                "description": "All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout the territory of India, to reside and settle in any part of the territory of India, and to practise any profession, or to carry on any occupation, trade or business.",
                "fundamental_right": True,
                "category": "Right to Freedom",
                "restrictions": ["Security of State", "Public order", "Decency or morality"]
            }
        }
    
    def _load_legal_procedures(self) -> Dict[str, Dict]:
        """Load legal procedures"""
        return {
            "fir_filing": {
                "title": "How to File an FIR",
                "steps": [
                    "Visit the nearest police station",
                    "Provide details of the incident",
                    "Ensure FIR is registered under CrPC Section 154",
                    "Get a copy of the FIR",
                    "Note down the FIR number"
                ],
                "documents_required": ["Identity proof", "Evidence (if any)", "Witness details"],
                "timeline": "Immediate registration required",
                "cost": "Free of charge",
                "legal_basis": "CrPC Section 154"
            },
            "property_registration": {
                "title": "Property Registration Process",
                "steps": [
                    "Verify property documents",
                    "Check encumbrance certificate",
                    "Draft sale deed",
                    "Pay stamp duty and registration fees",
                    "Visit sub-registrar office",
                    "Complete biometric verification",
                    "Collect registered documents"
                ],
                "documents_required": [
                    "Sale deed", "Identity proofs", "Address proofs", 
                    "Property tax receipts", "NOC from society", "Encumbrance certificate"
                ],
                "timeline": "1-7 days",
                "cost": "Stamp duty (varies by state) + Registration fees",
                "legal_basis": "Registration Act, 1908"
            }
        }
    
    def _load_document_templates(self) -> Dict[str, Dict]:
        """Load legal document templates"""
        return {
            "legal_notice": {
                "title": "Legal Notice Template",
                "purpose": "Formal notice before legal action",
                "format": """
LEGAL NOTICE

To: [Name and Address of Recipient]

TAKE NOTICE that my client [Client Name] hereby calls upon you to [specific demand/action required] within [time period] days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you.

[Detailed facts and legal grounds]

TAKE FURTHER NOTICE that if you fail to comply with the above demand, my client will be left with no alternative but to approach the competent court of law for appropriate relief including damages, costs and such other relief as deemed fit.

Advocate for [Client Name]
Date: [Date]
Place: [Place]
                """,
                "timeline": "Usually 15-30 days notice period",
                "legal_basis": "Various acts depending on the matter"
            }
        }
    
    def get_section_info(self, section: str, act: str = "ipc") -> Optional[Dict]:
        """Get information about a specific legal section"""
        act = act.lower()
        if act == "ipc" and section in self.ipc_sections:
            return self.ipc_sections[section]
        elif act == "crpc" and section in self.crpc_sections:
            return self.crpc_sections[section]
        return None
    
    def get_article_info(self, article: str) -> Optional[Dict]:
        """Get information about a constitutional article"""
        return self.constitutional_articles.get(article)
    
    def get_procedure_info(self, procedure: str) -> Optional[Dict]:
        """Get information about legal procedures"""
        return self.legal_procedures.get(procedure)
    
    def search_legal_content(self, query: str) -> List[Dict]:
        """Search across all legal content"""
        results = []
        query_lower = query.lower()
        
        # Search IPC sections
        for section, info in self.ipc_sections.items():
            if (query_lower in info['title'].lower() or 
                query_lower in info['description'].lower()):
                results.append({
                    'type': 'IPC Section',
                    'reference': f"Section {section}",
                    'title': info['title'],
                    'content': info['description'],
                    'relevance': 'high'
                })
        
        # Search Constitutional articles
        for article, info in self.constitutional_articles.items():
            if (query_lower in info['title'].lower() or 
                query_lower in info['description'].lower()):
                results.append({
                    'type': 'Constitutional Article',
                    'reference': f"Article {article}",
                    'title': info['title'],
                    'content': info['description'],
                    'relevance': 'high'
                })
        
        # Search procedures
        for proc_key, info in self.legal_procedures.items():
            if query_lower in info['title'].lower():
                results.append({
                    'type': 'Legal Procedure',
                    'reference': info['title'],
                    'title': info['title'],
                    'content': f"Steps: {len(info['steps'])} | Timeline: {info['timeline']}",
                    'relevance': 'medium'
                })
        
        return results[:5]  # Return top 5 results

# Test the knowledge base
kb = LegalKnowledgeBase()

print("Legal Knowledge Base Test:")
print("=" * 40)

# Test section lookup
section_420 = kb.get_section_info("420", "ipc")
print(f"IPC Section 420: {json.dumps(section_420, indent=2, ensure_ascii=False)}")

print("\n" + "-" * 40)

# Test article lookup
article_21 = kb.get_article_info("21")
print(f"Article 21: {json.dumps(article_21, indent=2, ensure_ascii=False)}")

print("\n" + "-" * 40)

# Test search
search_results = kb.search_legal_content("murder")
print(f"Search results for 'murder': {json.dumps(search_results, indent=2, ensure_ascii=False)}")
