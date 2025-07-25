// Documents functionality
document.addEventListener('DOMContentLoaded', () => {
    const documents = [
        {
            id: 1,
            title: "FIR Registration Application",
            description: "Template for filing First Information Report with police",
            category: "criminal",
            type: "Application",
            downloads: 1250,
            rating: 4.8,
            language: "English/Hindi",
            pages: 2,
            lastUpdated: "2024-01-15",
            trending: true,
        },
        {
            id: 2,
            title: "Property Sale Deed",
            description: "Comprehensive property sale agreement template",
            category: "property",
            type: "Agreement",
            downloads: 2100,
            rating: 4.9,
            language: "English/Hindi",
            pages: 8,
            lastUpdated: "2024-01-10",
            trending: true,
        },
        {
            id: 3,
            title: "Consumer Complaint Format",
            description: "Standard format for consumer court complaints",
            category: "consumer",
            type: "Complaint",
            downloads: 890,
            rating: 4.7,
            language: "English/Hindi",
            pages: 3,
            lastUpdated: "2024-01-12",
            trending: false,
        },
        {
            id: 4,
            title: "Divorce Petition (Mutual Consent)",
            description: "Mutual consent divorce petition template",
            category: "family",
            type: "Petition",
            downloads: 1560,
            rating: 4.6,
            language: "English/Hindi",
            pages: 5,
            lastUpdated: "2024-01-08",
            trending: false,
        },
        {
            id: 5,
            title: "Rent Agreement",
            description: "Standard residential rent agreement format",
            category: "property",
            type: "Agreement",
            downloads: 3200,
            rating: 4.9,
            language: "English/Hindi",
            pages: 6,
            lastUpdated: "2024-01-14",
            trending: true,
        },
        {
            id: 6,
            title: "Power of Attorney",
            description: "General power of attorney document template",
            category: "civil",
            type: "Authorization",
            downloads: 1800,
            rating: 4.8,
            language: "English/Hindi",
            pages: 4,
            lastUpdated: "2024-01-11",
            trending: false,
        },
        {
            id: 7,
            title: "Employment Contract",
            description: "Standard employment agreement template",
            category: "corporate",
            type: "Contract",
            downloads: 950,
            rating: 4.7,
            language: "English",
            pages: 7,
            lastUpdated: "2024-01-09",
            trending: false,
        },
        {
            id: 8,
            title: "Bail Application",
            description: "Template for bail application in criminal cases",
            category: "criminal",
            type: "Application",
            downloads: 720,
            rating: 4.5,
            language: "English/Hindi",
            pages: 3,
            lastUpdated: "2024-01-13",
            trending: true,
        },
    ];

    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const documentsGrid = document.getElementById('documents-grid');
    const popularGrid = document.getElementById('popular-grid');
    
    const currentFilter = 'all';
    const searchTerm = '';

    function getCategoryColor(category) {
        const colors = {
            criminal: 'bg-red',
            civil: 'bg-blue',
            property: 'bg-green',
            family: 'bg-purple',
            corporate: 'bg-indigo',\
            consumer: 'bg-
