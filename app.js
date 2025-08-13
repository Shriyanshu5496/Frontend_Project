document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resumeForm");
  const scoreDisplay = document.getElementById("scoreResult");
  const resumeFile = document.getElementById("resumeFile");
  const submitBtn = document.getElementById("checkBtn");
  const summaryDiv = document.getElementById("resumeSummary");
  const keywordInput = document.getElementById("keywords");
  const keywordMatchesDiv = document.getElementById("keywordMatches");
  const dropArea = document.getElementById("dropArea");
  const dropText = document.getElementById("dropText");
  const uploadStatus = document.getElementById("uploadStatus");
  const jobTypeSelect = document.getElementById("jobType");
  const jobTypeSearch = document.getElementById("jobTypeSearch");
  const selectedFileName = document.getElementById("selectedFileName");
  let extractedText = "";
  let keywords = [];

  // --- Job Types ---
  const jobTypes = [
    {
      title: "SDE 1",
      keywords:
        "Java, Python, Data Structures, Algorithms, OOP, Problem Solving, Git, REST, SQL, Debugging",
    },
    {
      title: "SDE 2",
      keywords:
        "Java, Python, System Design, Microservices, REST, SQL, NoSQL, Scalability, Code Review, Unit Testing, CI/CD, AWS",
    },
    {
      title: "SDE 3",
      keywords:
        "Java, Python, Distributed Systems, Architecture, Leadership, Mentoring, Design Patterns, Cloud, Performance Optimization, Security, DevOps",
    },
    {
      title: "Frontend Developer",
      keywords:
        "JavaScript, HTML, CSS, React, Vue, Angular, TypeScript, Bootstrap, SASS, Webpack",
    },
    {
      title: "Backend Developer",
      keywords:
        "Node.js, Express, Python, Django, Flask, Java, Spring, SQL, MongoDB, REST",
    },
    {
      title: "Full Stack Developer",
      keywords:
        "JavaScript, Node.js, React, HTML, CSS, Express, MongoDB, SQL, REST, API",
    },
    {
      title: "Data Scientist",
      keywords:
        "Python, R, Machine Learning, Pandas, NumPy, Scikit-learn, TensorFlow, Data Analysis, SQL, Statistics",
    },
    {
      title: "Data Analyst",
      keywords:
        "Excel, SQL, Python, Data Visualization, Tableau, Power BI, Statistics, Reporting, Analysis, R",
    },
    {
      title: "DevOps Engineer",
      keywords:
        "AWS, Azure, Docker, Kubernetes, CI/CD, Jenkins, Linux, Bash, Terraform, Ansible",
    },
    {
      title: "Mobile App Developer",
      keywords:
        "Android, iOS, Java, Kotlin, Swift, Flutter, React Native, Objective-C, Dart, Mobile UI",
    },
    {
      title: "UI/UX Designer",
      keywords:
        "Figma, Sketch, Adobe XD, Wireframing, Prototyping, User Research, Usability, Photoshop, Illustrator, Design Systems",
    },
    {
      title: "QA Engineer",
      keywords:
        "Testing, Selenium, Automation, Manual Testing, Test Cases, Bug Tracking, JIRA, Quality Assurance, Regression, API Testing",
    },
    {
      title: "Cloud Engineer",
      keywords:
        "AWS, Azure, GCP, CloudFormation, Terraform, Docker, Kubernetes, DevOps, Linux, CI/CD",
    },
    {
      title: "Cybersecurity Analyst",
      keywords:
        "Security, Penetration Testing, Vulnerability, Firewall, SIEM, Incident Response, Risk Assessment, Encryption, IDS, Compliance",
    },
    {
      title: "Project Manager",
      keywords:
        "Agile, Scrum, Kanban, Project Management, Jira, Trello, Leadership, Communication, Planning, Risk Management",
    },
    {
      title: "Business Analyst",
      keywords:
        "Requirements Gathering, Analysis, Documentation, Stakeholder, UML, Process Improvement, SQL, Reporting, Communication, Agile",
    },
    {
      title: "Network Engineer",
      keywords:
        "Networking, Cisco, Routing, Switching, Firewall, TCP/IP, LAN, WAN, VPN, Network Security",
    },
    {
      title: "System Administrator",
      keywords:
        "Linux, Windows Server, Active Directory, Bash, PowerShell, Networking, Virtualization, VMware, Monitoring, Backup",
    },
    {
      title: "AI Engineer",
      keywords:
        "Python, Machine Learning, Deep Learning, TensorFlow, PyTorch, NLP, Computer Vision, Data Science, Algorithms, AI",
    },
    {
      title: "Database Administrator",
      keywords:
        "SQL, Oracle, MySQL, PostgreSQL, Database Design, Backup, Recovery, Performance Tuning, Security, NoSQL",
    },
    {
      title: "Web Designer",
      keywords:
        "HTML, CSS, JavaScript, Photoshop, Illustrator, Figma, Responsive Design, UI, UX, Bootstrap",
    },
    {
      title: "Content Writer",
      keywords:
        "Writing, Editing, SEO, Blogging, Content Strategy, Research, Proofreading, Copywriting, WordPress, Communication",
    },
    {
      title: "Digital Marketer",
      keywords:
        "SEO, SEM, Google Analytics, Social Media, Content Marketing, PPC, Email Marketing, Campaigns, Branding, Strategy",
    },
    {
      title: "Product Manager",
      keywords:
        "Product Management, Roadmap, Agile, Scrum, User Stories, Market Research, Strategy, Communication, UX, Analytics",
    },
    {
      title: "Graphic Designer",
      keywords:
        "Photoshop, Illustrator, InDesign, Branding, Typography, Layout, Adobe Creative Suite, Logo Design, Print, Web Design",
    },
    {
      title: "Machine Learning Engineer",
      keywords:
        "Python, Machine Learning, Deep Learning, TensorFlow, PyTorch, Data Science, Algorithms, Model Deployment, Scikit-learn, NLP",
    },
    {
      title: "Salesforce Developer",
      keywords:
        "Salesforce, Apex, Visualforce, Lightning, CRM, SOQL, Triggers, Integration, Administration, Workflow",
    },
    {
      title: "IT Support Specialist",
      keywords:
        "Technical Support, Troubleshooting, Windows, Mac, Networking, Hardware, Software, Customer Service, Helpdesk, Active Directory",
    },
  ];

  function renderJobTypes(filter = "") {
    if (!jobTypeSelect) return;
    jobTypeSelect.innerHTML = "";
    jobTypes
      .filter((j) => j.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach((j) => {
        const opt = document.createElement("option");
        opt.value = j.title;
        opt.textContent = j.title;
        jobTypeSelect.appendChild(opt);
      });
  }
  if (jobTypeSelect) renderJobTypes();

  if (jobTypeSearch) {
    jobTypeSearch.addEventListener("input", function () {
      renderJobTypes(this.value);
    });
  }

  if (jobTypeSelect) {
    jobTypeSelect.addEventListener("change", function () {
      const selected = jobTypes.find((j) => j.title === this.value);
      if (selected) {
        keywordInput.value = selected.keywords;
      }
    });
    // On page load, set keywords for first job type
    if (jobTypes.length) {
      jobTypeSelect.selectedIndex = 0;
      keywordInput.value = jobTypes[0].keywords;
    }
  }

  // --- Drag & Drop ---
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove("dragover");
    });
  });
  dropArea.addEventListener("click", () => resumeFile.click());
  dropArea.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length) {
      resumeFile.files = files;
      handleFile(files[0]);
    }
  });
  resumeFile.addEventListener("change", (e) => {
    if (resumeFile.files.length) {
      handleFile(resumeFile.files[0]);
    }
  });

  function handleFile(file) {
    uploadStatus.textContent = "";
    uploadStatus.className = "";
    summaryDiv.innerHTML = "";
    scoreDisplay.innerHTML = "";
    keywordMatchesDiv.innerHTML = "";
    submitBtn.disabled = true;
    extractedText = "";

    if (!file || file.type !== "application/pdf") {
        uploadStatus.textContent = "Please upload a valid PDF file.";
        uploadStatus.classList.add("error");
        return;
    }

    // Show selected file name
    if (selectedFileName) {
        selectedFileName.textContent = file.name;
        selectedFileName.classList.add('show');  // Add 'show' class
    } else {
        selectedFileName.classList.remove('show');
    }

    uploadStatus.textContent = "Success!";
    uploadStatus.classList.add("success");
    setLoading(true);

    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        
        // Load the PDF
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        loadingTask.promise
            .then(function(pdf) {
                let textPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    textPromises.push(
                        pdf.getPage(i).then((page) => page.getTextContent())
                    );
                }
                return Promise.all(textPromises);
            })
            .then((pages) => {
                extractedText = pages
                    .map((page) => page.items.map((item) => item.str).join(" "))
                    .join("\n");
                summaryDiv.innerHTML = extractSummary(extractedText);
                setLoading(false);
                submitBtn.disabled = false;
            })
            .catch((err) => {
                console.error('PDF parsing error:', err);
                summaryDiv.innerHTML = `<div class="alert alert-danger" role="alert">Failed to extract text from PDF. Please try another file.</div>`;
                setLoading(false);
            });
    };
    fileReader.readAsArrayBuffer(file);
  }

  function setLoading(isLoading) {
    if (isLoading) {
      summaryDiv.innerHTML = `<div class="text-center my-3"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div><div>Extracting text from PDF...</div></div>`;
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
    }
  }

  function calculateATSBreakdown(resumeText, keywords) {
    let score = 0;
    let maxScore = 7; // Number of categories
    let breakdown = {
      keywords: 0,
      formatting: 0,
      structure: 0,
      experience: 0,
      actionVerbs: 0,
      education: 0,
      length: 0,
    };

    // 1. Keyword Matching (2 points)
    let keywordMatches = 0;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      if (resumeText.match(regex)) {
        keywordMatches += 1;
      }
    });
    breakdown.keywords = Math.round((keywordMatches / keywords.length) * 2); // up to 2 points
    score += breakdown.keywords;

    // 2. Formatting & File Type (1 point)
    // Assume PDF is uploaded, check for tables/images (very basic check)
    if (!/table|img|image|picture/i.test(resumeText)) {
      breakdown.formatting = 1;
      score += 1;
    }

    // 3. Structure & Readability (1 point)
    const hasSections =
      /education/i.test(resumeText) &&
      /experience/i.test(resumeText) &&
      /skills/i.test(resumeText);
    if (hasSections) {
      breakdown.structure = 1;
      score += 1;
    }

    // 4. Experience Relevance (1 point)
    // Check for job title match (from keywords or job type)
    const jobTitle = jobTypeSelect.value || "";
    if (jobTitle && new RegExp(jobTitle, "i").test(resumeText)) {
      breakdown.experience = 1;
      score += 1;
    }

    // 5. Action Verbs & Achievements (1 point)
    const actionVerbs = [
      "developed",
      "led",
      "implemented",
      "optimized",
      "increased",
      "improved",
      "managed",
      "designed",
      "built",
      "created",
    ];
    let foundVerb = actionVerbs.some((verb) =>
      new RegExp(`\\b${verb}\\b`, "i").test(resumeText)
    );
    let foundAchievement =
      /\b\d+%|\$\d+|\d+\s+(users|clients|projects|teams)\b/i.test(resumeText);
    if (foundVerb && foundAchievement) {
      breakdown.actionVerbs = 1;
      score += 1;
    }

    // 6. Education/Certifications (1 point)
    if (
      /b\.?tech|bachelor|master|phd|certified|certification|degree|diploma|aws|oracle|microsoft|google/i.test(
        resumeText
      )
    ) {
      breakdown.education = 1;
      score += 1;
    }

    // 7. Length & Relevance (1 point)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200 && wordCount < 1200) {
      breakdown.length = 1;
      score += 1;
    }

    return { score, maxScore, breakdown };
  }

  // Replace your form submit handler with this:
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!extractedText) {
      alert("Please upload a valid PDF resume first.");
      return;
    }
    const keywords = keywordInput.value.split(',').map(k => k.trim()).filter(Boolean);
    const atsResult = calculateATSBreakdown(extractedText, keywords);
    showATSScoreModal(atsResult, extractedText, keywords);
  });

  // Add this function to show the ATS Score Card in a popup
  function showATSScoreModal(atsResult, resumeText, keywords) {
    const modalBody = document.getElementById('atsScoreModalBody');
    
    // Show loading animation first
    modalBody.innerHTML = `
        <div id="loadingAnimation" class="loading-container text-center">
            <div class="pulse-ring"></div>
            <div class="loading-text">
                <i class="fas fa-robot breathing-icon"></i>
                <p class="mt-3">Analyzing Your Resume...</p>
            </div>
        </div>
    `;
    
    // Show modal with loading animation
    $('#atsScoreModal').modal('show');
    
    // Simulate analysis time (remove this in production)
    setTimeout(() => {
        const { score, maxScore, breakdown } = atsResult;
        const percent = Math.round((score / maxScore) * 100);
        const jobTitle = jobTypeSelect ? jobTypeSelect.value : "Not selected";
        let modalHtml = `
            <div class="text-center mb-3">
                <span class="badge badge-info" style="font-size:1rem;">
                    <i class="fas fa-briefcase"></i> Job Title: <b>${jobTitle}</b>
                </span>
            </div>
            <div class="ats-score-row fade-in-horizontal mb-3">
                <div class="score-details text-center">
                    <div class="score-number">${score} <span class="score-divider">/</span> ${maxScore}</div>
                    <div class="score-label">ATS Score</div>
                    <div class="score-percent">${percent}%</div>
                </div>
                <div class="score-progress flex-grow-1 align-self-center ml-4">
                    <div class="progress ats-progress">
                        <div class="progress-bar" role="progressbar" style="width: ${percent}%;" id="scoreBarModal">${percent}%</div>
                    </div>
                </div>
            </div>
            <div class="alert alert-success text-center mt-3 mb-0" role="alert">
                <p class="mb-1">The score is based on multiple ATS criteria:</p>
                <ul class="text-left mb-0" style="list-style:none;padding-left:0;">
                    <li><b>Keywords</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Presence of job-related keywords in your resume."></i>: ${breakdown.keywords}/2</li>
                    <li><b>Formatting</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="No tables, images, or unusual formatting."></i>: ${breakdown.formatting}/1</li>
                    <li><b>Structure</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Sections like Education, Experience, Skills are present."></i>: ${breakdown.structure}/1</li>
                    <li><b>Experience Relevance</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Your experience matches the job title."></i>: ${breakdown.experience}/1</li>
                    <li><b>Action Verbs & Achievements</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Use of action verbs and measurable results."></i>: ${breakdown.actionVerbs}/1</li>
                    <li><b>Education/Certifications</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Relevant degrees or certifications are listed."></i>: ${breakdown.education}/1</li>
                    <li><b>Length & Relevance</b> <i class="fas fa-info-circle" data-toggle="tooltip" title="Resume is not too short or too long."></i>: ${breakdown.length}/1</li>
                </ul>
            </div>
            <div class="mt-3">
                <strong>Keyword Matches:</strong><br>
                ${keywords
                  .map((keyword) => {
                    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
                    const found = resumeText.match(regex);
                    return `<span class="keyword-badge${
                      found ? " found" : " not-found"
                    }">${keyword}${found ? " ✓" : " ✗"}</span>`;
                  })
                  .join(" ")}
            </div>
            <div id="resumeMistakesList" class="mt-4"></div>
        `;
        document.getElementById("atsScoreModalBody").innerHTML = modalHtml;
        $('[data-toggle="tooltip"]').tooltip();
        $("#atsScoreModal").modal("show");

        // Analyze and show mistakes
        const mistakes = analyzeResumeMistakes(resumeText, atsResult);
        const mistakesHtml = mistakes.map(mistake => `
            <div class="mistake-item ${mistake.type}">
                <div class="mistake-header">
                    <i class="fas ${mistake.type === 'critical' ? 'fa-times-circle' : 
                                   mistake.type === 'major' ? 'fa-exclamation-circle' : 
                                   'fa-info-circle'}"></i>
                    <span>${mistake.message}</span>
                </div>
                <div class="mistake-fix">
                    <i class="fas fa-lightbulb"></i> ${mistake.fix}
                </div>
            </div>
        `).join('');

        document.getElementById('resumeMistakesList').innerHTML = mistakesHtml;
    }, 2000); // Shows loading for 2 seconds
  }

  function analyzeResumeMistakes(resumeText, atsResult) {
    const mistakes = [];
    
    // Check for contact information
    if (!resumeText.match(/[A-Za-z0-9._%+-]+@[A-ZaZ0-9.-]+\.[A-Za-z]{2,}/)) {
        mistakes.push({
            type: 'critical',
            message: 'Missing or invalid email address',
            fix: 'Add a professional email address at the top of your resume.'
        });
    }

    // Check for phone number
    if (!resumeText.match(/(\+\d{1,3}[-.]?)?\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
        mistakes.push({
            type: 'critical',
            message: 'Missing or invalid phone number',
            fix: 'Add your contact phone number in a clear format.'
        });
    }

    // Check for education section
    if (!resumeText.toLowerCase().includes('education') || atsResult.breakdown.education === 0) {
        mistakes.push({
            type: 'major',
            message: 'Missing or weak education section',
            fix: 'Add your educational background with degrees, institutions, and graduation dates.'
        });
    }

    // Check for experience section
    if (!resumeText.toLowerCase().includes('experience') || atsResult.breakdown.experience === 0) {
        mistakes.push({
            type: 'major',
            message: 'Missing or weak experience section',
            fix: 'Add detailed work experience with company names, dates, and achievements.'
        });
    }

    // Check for skills section
    if (!resumeText.toLowerCase().includes('skills')) {
        mistakes.push({
            type: 'moderate',
            message: 'Missing dedicated skills section',
            fix: 'Add a clear skills section highlighting your technical and soft skills.'
        });
    }

    // Check for action verbs
    if (atsResult.breakdown.actionVerbs === 0) {
        mistakes.push({
            type: 'moderate',
            message: 'Weak action verbs usage',
            fix: 'Use strong action verbs like "achieved", "implemented", "led" to describe your experiences.'
        });
    }

    // Check resume length (rough estimate)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 300) {
        mistakes.push({
            type: 'moderate',
            message: 'Resume might be too short',
            fix: 'Add more details about your experiences and achievements. Aim for 400-600 words.'
        });
    }
    if (wordCount > 1000) {
        mistakes.push({
            type: 'moderate',
            message: 'Resume might be too long',
            fix: 'Consider condensing your content to keep it concise and relevant.'
        });
    }

    return mistakes;
}

  // Update your score display function:
  function updateScoreDisplay(atsResult) {
    const { score, maxScore, breakdown } = atsResult;
    const percent = Math.round((score / maxScore) * 100);
    scoreDisplay.innerHTML = `
            <div class="ats-score-row fade-in-horizontal">
                <div class="score-details text-center">
                    <div class="score-number">${score} <span class="score-divider">/</span> ${maxScore}</div>
                    <div class="score-label">ATS Score</div>
                    <div class="score-percent">${percent}%</div>
                </div>
                <div class="score-progress flex-grow-1 align-self-center ml-4">
                    <div class="progress ats-progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" id="scoreBar">${percent}%</div>
                    </div>
                </div>
            </div>
            <div class="alert alert-success text-center mt-3 mb-0" role="alert">
                <p class="mb-1">The score is based on multiple ATS criteria:</p>
                <ul class="text-left mb-0" style="list-style:none;padding-left:0;">
                    <li><b>Keywords:</b> ${breakdown.keywords}/2</li>
                    <li><b>Formatting:</b> ${breakdown.formatting}/1</li>
                    <li><b>Structure:</b> ${breakdown.structure}/1</li>
                    <li><b>Experience Relevance:</b> ${breakdown.experience}/1</li>
                    <li><b>Action Verbs & Achievements:</b> ${breakdown.actionVerbs}/1</li>
                    <li><b>Education/Certifications:</b> ${breakdown.education}/1</li>
                    <li><b>Length & Relevance:</b> ${breakdown.length}/1</li>
                </ul>
            </div>
        `;
    setTimeout(() => {
      document.getElementById("scoreBar").style.width = percent + "%";
    }, 100);
  }

  function showKeywordMatches(resumeText, keywords) {
    let html = `<div class="mb-2"><strong>Keyword Matches:</strong></div>`;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const found = resumeText.match(regex);
      html += `<span class="keyword-badge${
        found ? " found" : " not-found"
      }">${keyword}${found ? " ✓" : " ✗"}</span>`;
    });
    keywordMatchesDiv.innerHTML = html;
  }

  function extractSummary(text) {
    const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );
    const phoneMatch = text.match(
      /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
    );
    const skillsMatch = text.match(
      /Skills\s*[:\-]?\s*([\s\S]*?)(Education|Experience|Projects|$)/i
    );
    const educationMatch = text.match(
      /Education\s*[:\-]?\s*([\s\S]*?)(Experience|Skills|Projects|$)/i
    );
    const experienceMatch = text.match(
      /Experience\s*[:\-]?\s*([\s\S]*?)(Education|Skills|Projects|$)/i
    );

    return `
            <h5 class="mb-2">Resume Summary</h5>
            <div class="row">
                <div class="col-md-6 mb-2"><strong>Name:</strong> ${
                  nameMatch ? nameMatch[0] : "Not found"
                }</div>
                <div class="col-md-6 mb-2"><strong>Email:</strong> ${
                  emailMatch ? emailMatch[0] : "Not found"
                }</div>
                <div class="col-md-6 mb-2"><strong>Phone:</strong> ${
                  phoneMatch ? phoneMatch[0] : "Not found"
                }</div>
                <div class="col-md-6 mb-2"><strong>Skills:</strong> ${
                  skillsMatch
                    ? skillsMatch[1].replace(/\n/g, ", ")
                    : "Not found"
                }</div>
                <div class="col-md-6 mb-2"><strong>Education:</strong> ${
                  educationMatch
                    ? educationMatch[1].split("\n")[0]
                    : "Not found"
                }</div>
                <div class="col-md-6 mb-2"><strong>Experience:</strong> ${
                  experienceMatch
                    ? experienceMatch[1].split("\n")[0]
                    : "Not found"
                }</div>
            </div>
        `;
  }

  // Add at the end of your DOMContentLoaded function
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.className = "fas fa-sun";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      if (themeIcon)
        themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});
