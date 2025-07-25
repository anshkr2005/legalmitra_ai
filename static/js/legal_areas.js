// Legal Areas functionality
document.addEventListener("DOMContentLoaded", () => {
  const legalAreas = [
    {
      title: "Indian Penal Code (IPC)",
      description: "Criminal offenses, punishments, and procedures under Indian criminal law",
      icon: "gavel",
      color: "bg-red",
      topics: ["Murder", "Theft", "Fraud", "Assault", "Defamation"],
      cases: "10,000+ cases",
      popularity: 95,
      trending: true,
    },
    {
      title: "Criminal Procedure Code (CrPC)",
      description: "Procedures for investigation, inquiry, trial of criminal offenses",
      icon: "scale",
      color: "bg-blue",
      topics: ["FIR", "Arrest", "Bail", "Trial", "Appeal"],
      cases: "8,500+ cases",
      popularity: 88,
      trending: false,
    },
    {
      title: "Civil Procedure Code (CPC)",
      description: "Procedures for civil suits and court proceedings",
      icon: "file-text",
      color: "bg-green",
      topics: ["Civil Suits", "Injunctions", "Appeals", "Execution"],
      cases: "12,000+ cases",
      popularity: 82,
      trending: true,
    },
    {
      title: "Property Law",
      description: "Real estate transactions, property rights, and disputes",
      icon: "home",
      color: "bg-purple",
      topics: ["Sale Deed", "Registration", "Disputes", "Inheritance"],
      cases: "15,000+ cases",
      popularity: 92,
      trending: true,
    },
    {
      title: "Consumer Protection Act",
      description: "Consumer rights, complaints, and redressal mechanisms",
      icon: "shield",
      color: "bg-orange",
      topics: ["Defective Products", "Service Deficiency", "Unfair Practices"],
      cases: "6,000+ cases",
      popularity: 75,
      trending: false,
    },
    {
      title: "Family Law",
      description: "Marriage, divorce, custody, maintenance, and inheritance",
      icon: "heart",
      color: "bg-red",
      topics: ["Divorce", "Custody", "Maintenance", "Adoption"],
      cases: "9,000+ cases",
      popularity: 78,
      trending: false,
    },
    {
      title: "Labour Law",
      description: "Employment rights, workplace safety, and industrial relations",
      icon: "users",
      color: "bg-indigo",
      topics: ["Employment", "Wages", "Safety", "Termination"],
      cases: "7,500+ cases",
      popularity: 70,
      trending: true,
    },
    {
      title: "Corporate Law",
      description: "Company formation, compliance, mergers, and corporate governance",
      icon: "briefcase",
      color: "bg-indigo",
      topics: ["Company Formation", "Compliance", "Mergers", "Governance"],
      cases: "4,000+ cases",
      popularity: 65,
      trending: false,
    },
    {
      title: "Constitutional Law",
      description: "Fundamental rights, constitutional provisions, and public law",
      icon: "book-open",
      color: "bg-blue",
      topics: ["Fundamental Rights", "Directive Principles", "Amendments"],
      cases: "3,500+ cases",
      popularity: 68,
      trending: false,
    },
    {
      title: "Tax Law",
      description: "Income tax, GST, customs, and other taxation matters",
      icon: "calculator",
      color: "bg-green",
      topics: ["Income Tax", "GST", "Customs", "Appeals"],
      cases: "5,500+ cases",
      popularity: 72,
      trending: true,
    },
  ]

  const searchInput = document.getElementById("search-input")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const legalAreasGrid = document.getElementById("legal-areas-grid")

  let currentFilter = "all"
  let searchTerm = ""

  function renderLegalAreas() {
    const filteredAreas = legalAreas.filter((area) => {
      const matchesSearch =
        area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "trending" && area.trending) ||
        (currentFilter === "popular" && area.popularity > 80)
      return matchesSearch && matchesFilter
    })

    legalAreasGrid.innerHTML = ""

    if (filteredAreas.length === 0) {
      legalAreasGrid.innerHTML = `
                <div class="no-results">
                    <i data-lucide="scale" class="no-results-icon"></i>
                    <h3>No legal areas found</h3>
                    <p>Try adjusting your search terms or filters</p>
                    <a href="/chat" class="btn btn-primary">Ask AI for Help</a>
                </div>
            `
      if (typeof lucide !== "undefined") {
        lucide.createIcons()
      }
      return
    }

    filteredAreas.forEach((area, index) => {
      const areaCard = document.createElement("div")
      areaCard.className = "card legal-area-card"
      areaCard.style.animationDelay = `${index * 100}ms`

      areaCard.innerHTML = `
                ${area.trending ? '<div class="trending-badge"><i data-lucide="trending-up"></i> Trending</div>' : ""}
                <div class="area-header">
                    <div class="area-icon ${area.color}">
                        <i data-lucide="${area.icon}"></i>
                    </div>
                    <div class="area-info">
                        <h3>${area.title}</h3>
                        <div class="area-meta">
                            <span class="cases-count">${area.cases}</span>
                            <div class="popularity">
                                <i data-lucide="star"></i>
                                <span>${area.popularity}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="area-description">${area.description}</p>
                <div class="area-topics">
                    <p class="topics-label">Key Topics:</p>
                    <div class="topics-list">
                        ${area.topics.map((topic) => `<span class="topic-tag">${topic}</span>`).join("")}
                    </div>
                </div>
                <div class="popularity-bar">
                    <div class="popularity-label">
                        <span>Popularity</span>
                        <span>${area.popularity}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${area.popularity}%"></div>
                    </div>
                </div>
                <div class="area-actions">
                    <a href="/chat?topic=${encodeURIComponent(area.title)}" class="btn btn-primary">
                        <i data-lucide="message-circle"></i>
                        <span>Ask Questions</span>
                    </a>
                    <a href="/documents?category=${area.title.toLowerCase().replace(/\s+/g, "-")}" class="btn btn-secondary">
                        <i data-lucide="file-text"></i>
                    </a>
                </div>
            `

      legalAreasGrid.appendChild(areaCard)
    })

    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  // Search functionality
  searchInput.addEventListener(
    "input",
    debounce((e) => {
      searchTerm = e.target.value
      renderLegalAreas()
    }, 300),
  )

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")
      currentFilter = button.getAttribute("data-filter")
      renderLegalAreas()
    })
  })

  // Initial render
  renderLegalAreas()

  // Add custom styles
  const style = document.createElement("style")
  style.textContent = `
        .legal-area-card {
            position: relative;
            overflow: hidden;
        }
        
        .trending-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            z-index: 2;
        }
        
        .area-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .area-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
        }
        
        .legal-area-card:hover .area-icon {
            transform: scale(1.25) rotate(12deg);
        }
        
        .area-info h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .area-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .popularity {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .popularity i {
            color: #fbbf24;
            width: 1rem;
            height: 1rem;
        }
        
        .area-description {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .area-topics {
            margin-bottom: 1rem;
        }
        
        .topics-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
        }
        
        .topics-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .topic-tag {
            background: #f3f4f6;
            color: #374151;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .topic-tag:hover {
            background: #667eea;
            color: white;
        }
        
        .popularity-bar {
            margin-bottom: 1rem;
        }
        
        .popularity-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .progress-bar {
            width: 100%;
            height: 0.5rem;
            background: #e5e7eb;
            border-radius: 0.25rem;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            transition: width 1s ease-out;
        }
        
        .area-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .area-actions .btn {
            flex: 1;
        }
        
        .area-actions .btn-secondary {
            flex: 0 0 auto;
            width: 3rem;
            height: 3rem;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }
        
        .no-results-icon {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1rem;
            opacity: 0.5;
        }
        
        .no-results h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .no-results p {
            margin-bottom: 1.5rem;
        }
    `
  document.head.appendChild(style)
})

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
