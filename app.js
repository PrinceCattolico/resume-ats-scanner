// ResumeRadar ATS Intelligence Engine & Scanner
(function () {
  // Comprehensive Skill & Tech Lexicon
  const SKILL_DATABASE = {
    technical: [
      "python", "javascript", "typescript", "react", "react.js", "next.js", "node.js", "node", "express",
      "vue", "vue.js", "angular", "html5", "css3", "tailwind", "tailwind css", "sass", "bootstrap",
      "sql", "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "sqlite",
      "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
      "ci/cd", "github actions", "gitlab", "jenkins", "terraform", "ansible", "linux", "bash",
      "git", "rest", "rest api", "restful", "graphql", "grpc", "microservices", "serverless",
      "java", "spring boot", "c++", "c#", ".net", "golang", "go", "rust", "php", "ruby", "rails",
      "machine learning", "deep learning", "ai", "artificial intelligence", "nlp", "llm", "pandas",
      "numpy", "pytorch", "tensorflow", "scikit-learn", "data science", "data analysis", "tableau", "power bi"
    ],
    business: [
      "project management", "product management", "agile", "scrum", "kanban", "jira", "confluence",
      "okr", "kpi", "roi", "stakeholder management", "cross-functional", "roadmap", "user research",
      "a/b testing", "product strategy", "business development", "crm", "salesforce", "hubspot",
      "customer success", "market research", "growth hacking", "seo", "sem", "content strategy"
    ],
    soft: [
      "leadership", "mentorship", "collaboration", "communication", "problem solving",
      "critical thinking", "adaptability", "time management", "conflict resolution",
      "strategic planning", "public speaking", "negotiation", "analytical skills"
    ]
  };

  const STRONG_ACTION_VERBS = [
    "spearheaded", "orchestrated", "architected", "engineered", "streamlined", "automated",
    "optimized", "scaled", "pioneered", "championed", "delivered", "executed", "accelerated",
    "designed", "devised", "formulated", "overhauled", "transformed", "reduced", "maximized"
  ];

  const WEAK_VERBS = [
    "worked on", "responsible for", "helped with", "assisted", "participated in",
    "handled", "did", "tasked with", "was involved in", "duties included"
  ];

  // Sample Data for 1-Click Demo
  const SAMPLE_RESUME = `ALEX MORGAN
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Engineer with 4+ years of experience building and scaling modern web applications. Passionate about developer tooling, API design, and cloud architecture. Proven track record of improving site performance and reliability.

SKILLS
- Languages & Frameworks: JavaScript, TypeScript, React, Node.js, Express, HTML5, CSS3, Tailwind CSS
- Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker, Git, CI/CD
- Concepts: REST APIs, Microservices, Agile/Scrum, Test-Driven Development (TDD)

WORK EXPERIENCE
Senior Frontend Developer | TechFlow Inc. (2022 - Present)
- Worked on redesigning customer-facing dashboard using React and TypeScript.
- Improved application load time by 38% through code splitting, lazy loading, and asset caching.
- Collaborated with product managers and backend engineers in bi-weekly Agile sprints.
- Responsible for mentoring 2 junior engineers and conducting code reviews across 5 repos.

Software Engineer | CloudScale Systems (2020 - 2022)
- Built and maintained RESTful APIs in Node.js and PostgreSQL handling 1.5M requests daily.
- Automated deployment workflows using GitHub Actions and Docker, reducing deploy time by 50%.
- Assisted in migration of legacy monolith to microservices architecture.
- Designed database schemas and wrote optimized SQL queries reducing latency by 25%.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2016 - 2020)`;

  const SAMPLE_JOB = `Senior Full Stack Engineer
Company: Apex Innovations
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking an experienced Full Stack Engineer to join our core product team. You will build high-concurrency cloud systems, design robust APIs, and scale our frontend web platform.

Key Requirements:
- 4+ years software engineering experience with modern JavaScript, TypeScript, and React.
- Strong proficiency in Node.js, Express, and distributed microservices architecture.
- Hands-on experience with AWS cloud services (Lambda, ECS, S3, RDS) and Docker containerization.
- Solid understanding of PostgreSQL and Redis caching strategies.
- Experience with Kubernetes (k8s) and Terraform for Infrastructure-as-Code is a huge plus.
- Familiarity with GraphQL, Next.js, and CI/CD pipelines.
- Demonstrated ability to deliver quantifiable business impact and lead cross-functional initiatives.
- Excellent communication, problem solving, and mentorship abilities in an Agile environment.`;

  // DOM Elements
  const resumeInput = document.getElementById("resume-input");
  const jobInput = document.getElementById("job-input");
  const btnScan = document.getElementById("btn-scan");
  const btnSample = document.getElementById("btn-sample");
  const btnClear = document.getElementById("btn-clear");
  const resultsDashboard = document.getElementById("results-dashboard");
  const gaugeNumber = document.getElementById("gauge-number");
  const gaugeCircle = document.querySelector(".gauge-val");
  const scoreVerdict = document.getElementById("score-verdict");
  const scoreSubtext = document.getElementById("score-subtext");

  // Metrics
  const metricKeyword = document.getElementById("metric-keyword");
  const metricKeywordBar = document.getElementById("metric-keyword-bar");
  const metricImpact = document.getElementById("metric-impact");
  const metricImpactBar = document.getElementById("metric-impact-bar");
  const metricFormat = document.getElementById("metric-format");
  const metricFormatBar = document.getElementById("metric-format-bar");
  const metricReadability = document.getElementById("metric-readability");
  const metricReadabilityBar = document.getElementById("metric-readability-bar");

  // Keyword Boxes
  const matchedPillsContainer = document.getElementById("matched-pills");
  const missingPillsContainer = document.getElementById("missing-pills");
  const matchedCount = document.getElementById("matched-count");
  const missingCount = document.getElementById("missing-count");

  // Bullets & Cover Letter
  const bulletContainer = document.getElementById("bullet-optimizer-list");
  const coverLetterOutput = document.getElementById("cover-letter-output");
  const btnCopyCover = document.getElementById("btn-copy-cover");

  // Modal
  const templateModal = document.getElementById("template-modal");
  const btnTemplatesNav = document.getElementById("btn-templates-nav");
  const btnTemplatesBanner = document.getElementById("btn-templates-banner");
  const btnCloseModal = document.getElementById("btn-close-modal");

  // Event Listeners
  btnSample.addEventListener("click", () => {
    resumeInput.value = SAMPLE_RESUME;
    jobInput.value = SAMPLE_JOB;
    updateCounts();
  });

  btnClear.addEventListener("click", () => {
    resumeInput.value = "";
    jobInput.value = "";
    resultsDashboard.style.display = "none";
    updateCounts();
  });

  resumeInput.addEventListener("input", updateCounts);
  jobInput.addEventListener("input", updateCounts);

  function updateCounts() {
    const resumeWords = resumeInput.value.trim() ? resumeInput.value.trim().split(/\s+/).length : 0;
    const jobWords = jobInput.value.trim() ? jobInput.value.trim().split(/\s+/).length : 0;
    document.getElementById("resume-count").innerText = `${resumeWords} words`;
    document.getElementById("job-count").innerText = `${jobWords} words`;
  }

  // Tabs Handling
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // Modal Handlers
  if (btnTemplatesNav) btnTemplatesNav.addEventListener("click", () => templateModal.style.display = "flex");
  if (btnTemplatesBanner) btnTemplatesBanner.addEventListener("click", () => templateModal.style.display = "flex");
  if (btnCloseModal) btnCloseModal.addEventListener("click", () => templateModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === templateModal) templateModal.style.display = "none";
  });

  // Main Scan Trigger
  btnScan.addEventListener("click", () => {
    const resumeText = resumeInput.value.trim();
    const jobText = jobInput.value.trim();

    if (!resumeText || !jobText) {
      alert("Please provide both your Resume and the Job Description to perform a scan.");
      return;
    }

    analyzeATS(resumeText, jobText);
  });

  // Extraction & Matching Algorithm
  function extractKeywords(text) {
    const lower = text.toLowerCase();
    const foundKeywords = new Set();

    // Check all dictionaries
    const allKeywords = [
      ...SKILL_DATABASE.technical,
      ...SKILL_DATABASE.business,
      ...SKILL_DATABASE.soft
    ];

    allKeywords.forEach(kw => {
      // Regex boundary check
      const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
      if (regex.test(lower)) {
        foundKeywords.add(kw);
      }
    });

    return Array.from(foundKeywords);
  }

  function analyzeATS(resume, job) {
    const resumeKeywords = extractKeywords(resume);
    const jobKeywords = extractKeywords(job);

    // Keyword Match Breakdown
    const matched = [];
    const missing = [];

    jobKeywords.forEach(kw => {
      if (resumeKeywords.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const keywordMatchRate = jobKeywords.length > 0
      ? Math.round((matched.length / jobKeywords.length) * 100)
      : 80;

    // Action Verb & Impact Analysis
    const lowerResume = resume.toLowerCase();
    let strongVerbCount = 0;
    STRONG_ACTION_VERBS.forEach(v => {
      if (lowerResume.includes(v)) strongVerbCount++;
    });

    // Quantifiable Metrics Score (% or $ or numbers)
    const metricMatches = resume.match(/\b\d+(\.\d+)?%|\$\d+[\d,]*|\b\d+x\b|\b\d+\s*(users|clients|requests|deployments|engineers|teams|projects|sprints)\b/gi) || [];
    const metricCount = metricMatches.length;

    const impactScore = Math.min(100, Math.round((strongVerbCount * 12) + (metricCount * 8)));

    // Formatting & Completeness
    let formatPoints = 40;
    if (lowerResume.includes("education")) formatPoints += 15;
    if (lowerResume.includes("experience") || lowerResume.includes("employment")) formatPoints += 15;
    if (lowerResume.includes("skills")) formatPoints += 15;
    if (lowerResume.includes("@") && lowerResume.includes(".com")) formatPoints += 15;
    const formatScore = Math.min(100, formatPoints);

    // Readability & Length
    const wordCount = resume.trim().split(/\s+/).length;
    let readabilityScore = 90;
    if (wordCount < 200) readabilityScore = 55;
    else if (wordCount > 900) readabilityScore = 65;

    // Overall ATS Weighted Score
    const totalATSScore = Math.round(
      (keywordMatchRate * 0.45) +
      (impactScore * 0.25) +
      (formatScore * 0.15) +
      (readabilityScore * 0.15)
    );

    displayResults({
      totalScore: totalATSScore,
      keywordMatchRate,
      impactScore,
      formatScore,
      readabilityScore,
      matched,
      missing,
      resume,
      job
    });
  }

  function displayResults(data) {
    resultsDashboard.style.display = "block";
    resultsDashboard.scrollIntoView({ behavior: "smooth" });

    // Animated Score Ring
    gaugeNumber.innerText = data.totalScore;
    const circumference = 2 * Math.PI * 60; // r=60
    const offset = circumference - (data.totalScore / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;

    // Gauge Color & Verdict
    if (data.totalScore >= 80) {
      gaugeCircle.style.stroke = "#10b981";
      scoreVerdict.innerText = "Interview Ready! 🚀";
      scoreVerdict.style.color = "#34d399";
      scoreSubtext.innerText = "Exceptional keyword alignment and strong impact phrasing. Your resume stands an outstanding chance with automated ATS screeners.";
    } else if (data.totalScore >= 60) {
      gaugeCircle.style.stroke = "#f59e0b";
      scoreVerdict.innerText = "Moderate Match — Action Needed ⚠️";
      scoreVerdict.style.color = "#fbbf24";
      scoreSubtext.innerText = `You match ${data.matched.length} key terms, but missing ${data.missing.length} core job requirements could drop you below recruiter cutoffs. Add the missing keywords below.`;
    } else {
      gaugeCircle.style.stroke = "#ef4444";
      scoreVerdict.innerText = "High Risk of ATS Rejection ❌";
      scoreVerdict.style.color = "#f87171";
      scoreSubtext.innerText = "Your resume is missing critical technical and domain keywords required by the employer's screening algorithm.";
    }

    // Mini Metric Cards
    metricKeyword.innerText = `${data.keywordMatchRate}%`;
    metricKeywordBar.style.width = `${data.keywordMatchRate}%`;

    metricImpact.innerText = `${data.impactScore}%`;
    metricImpactBar.style.width = `${data.impactScore}%`;

    metricFormat.innerText = `${data.formatScore}%`;
    metricFormatBar.style.width = `${data.formatScore}%`;

    metricReadability.innerText = `${data.readabilityScore}%`;
    metricReadabilityBar.style.width = `${data.readabilityScore}%`;

    // Render Keyword Matrix
    matchedCount.innerText = data.matched.length;
    missingCount.innerText = data.missing.length;

    matchedPillsContainer.innerHTML = data.matched.length > 0
      ? data.matched.map(kw => `<span class="pill-match">✓ ${escapeHtml(kw)}</span>`).join("")
      : `<span style="color:var(--text-muted); font-size:0.85rem;">No direct matching keywords detected.</span>`;

    missingPillsContainer.innerHTML = data.missing.length > 0
      ? data.missing.map(kw => `
        <span class="pill-missing" onclick="suggestBulletFor('${escapeHtml(kw)}')">
          + ${escapeHtml(kw)} <span class="pill-action-icon">💡</span>
        </span>`).join("")
      : `<span style="color:#34d399; font-size:0.85rem;">🎉 Zero missing required keywords found!</span>`;

    // Render Bullet Point Optimizations
    generateBulletOptimizations(data.resume, data.missing);

    // Generate Tailored Cover Letter
    generateCoverLetter(data.resume, data.job, data.matched, data.missing);
  }

  function generateBulletOptimizations(resume, missingKeywords) {
    bulletContainer.innerHTML = "";

    const lines = resume.split("\n").filter(l => l.trim().startsWith("-") || l.trim().startsWith("•"));
    const weakBullets = lines.filter(line => {
      const lower = line.toLowerCase();
      return WEAK_VERBS.some(v => lower.includes(v)) || !line.match(/\d+/);
    }).slice(0, 3);

    if (weakBullets.length === 0) {
      bulletContainer.innerHTML = `
        <div style="padding:1rem; color:#34d399; font-size:0.9rem;">
          ✨ All detected resume bullet points utilize strong action verbs and metrics!
        </div>`;
      return;
    }

    weakBullets.forEach((bullet, idx) => {
      const cleanBullet = bullet.replace(/^[-•]\s*/, "");
      const suggestedKeyword = missingKeywords[idx] || "scalability";

      // Enhanced STAR re-write
      const improved = `Spearheaded initiatives focusing on ${suggestedKeyword}, optimizing workflows and reducing operational latency by 32% across production systems.`;

      const card = document.createElement("div");
      card.className = "bullet-card";
      card.innerHTML = `
        <div class="bullet-before">
          <span>⚠️ Original:</span>
          <span>"${escapeHtml(cleanBullet)}"</span>
        </div>
        <div class="bullet-after">
          <div>
            <strong style="color:#34d399; font-size:0.75rem; text-transform:uppercase; display:block; margin-bottom:0.2rem;">ATS Optimized (STAR Impact):</strong>
            ${escapeHtml(improved)}
          </div>
          <button class="btn-copy-sm" onclick="copyText('${escapeHtml(improved)}')">Copy</button>
        </div>
      `;
      bulletContainer.appendChild(card);
    });
  }

  function generateCoverLetter(resume, job, matched, missing) {
    const jobTitleMatch = job.match(/([A-Z][a-zA-Z0-9\s]+(?:Engineer|Developer|Manager|Designer|Analyst|Architect|Lead|Director))/);
    const targetTitle = jobTitleMatch ? jobTitleMatch[1].trim() : "Software Engineer";

    const topSkills = matched.slice(0, 4).join(", ") || "full-stack development and cloud architecture";

    const letter = `Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${targetTitle} position. With a strong track record of engineering scalable applications and delivering measurable business impact, I was immediately drawn to this opportunity.

Throughout my career, I have specialized in ${topSkills}. In my recent experience, I have led cross-functional technical initiatives, reduced latency by 38%, and automated deployment pipelines to enhance developer productivity and system reliability.

I am particularly excited about how your team approaches scaling modern web infrastructure. My technical background aligns directly with your requirements, specifically in building robust, performant architectures and collaborating in high-velocity Agile teams.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my technical skills and proactive mindset can contribute directly to your team's goals.

Sincerely,
Alex Morgan
(555) 234-5678 | alex.morgan@email.com`;

    coverLetterOutput.innerText = letter;

    btnCopyCover.onclick = () => {
      navigator.clipboard.writeText(letter).then(() => {
        btnCopyCover.innerText = "Copied! ✓";
        setTimeout(() => btnCopyCover.innerText = "Copy to Clipboard", 2000);
      });
    };
  }

  // Global Helper Functions
  window.suggestBulletFor = function(keyword) {
    alert(`💡 ATS Pro-Tip for "${keyword}":\n\nAdd a bullet point like:\n"Leveraged ${keyword} to design and deploy automated data pipelines, accelerating feature delivery by 25%."`);
  };

  window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Bullet point copied to clipboard!");
    });
  };

  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial setup
  updateCounts();
})();
