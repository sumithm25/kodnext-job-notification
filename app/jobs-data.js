/**
 * Job Notification Tracker — Local Dataset (India)
 * 60 realistic tech jobs for rendering demos.
 *
 * Note: URLs are realistic-looking placeholders.
 */

(function () {
  /** @type {Array<{
   *  id: string,
   *  title: string,
   *  company: string,
   *  location: string,
   *  mode: "Remote"|"Hybrid"|"Onsite",
   *  experience: "Fresher"|"0-1"|"1-3"|"3-5",
   *  skills: string[],
   *  source: "LinkedIn"|"Naukri"|"Indeed",
   *  postedDaysAgo: number,
   *  salaryRange: string,
   *  applyUrl: string,
   *  description: string
   * }>} */
  const jobs = [
    {
      id: "job-001",
      title: "SDE Intern",
      company: "Flipkart",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["DSA", "Java", "SQL", "Git"],
      source: "LinkedIn",
      postedDaysAgo: 0,
      salaryRange: "₹25k–₹40k/month Internship",
      applyUrl: "https://careers.flipkart.com/jobs/job-001",
      description:
        "Work with a backend team building internal services.\nContribute to well-scoped tasks with mentorship.\nWrite clean code, tests, and short design notes.\nLearn production debugging and on-call hygiene.",
    },
    {
      id: "job-002",
      title: "Graduate Engineer Trainee",
      company: "TCS",
      location: "Pune",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["Java", "OOP", "SQL", "Communication"],
      source: "Naukri",
      postedDaysAgo: 2,
      salaryRange: "3–5 LPA",
      applyUrl: "https://www.tcs.com/careers/job-002",
      description:
        "Join a delivery team and build foundational engineering skills.\nRotate across modules to learn SDLC practices.\nWrite maintainable code with code reviews.\nSupport basic troubleshooting with guidance.",
    },
    {
      id: "job-003",
      title: "Junior Backend Developer",
      company: "Razorpay",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["Node.js", "REST APIs", "PostgreSQL", "Redis"],
      source: "LinkedIn",
      postedDaysAgo: 1,
      salaryRange: "10–18 LPA",
      applyUrl: "https://razorpay.com/jobs/job-003",
      description:
        "Build backend APIs for high-throughput payments workflows.\nCollaborate with product and platform teams.\nImplement observability and graceful failure handling.\nShip in small batches with strong ownership.",
    },
    {
      id: "job-004",
      title: "Frontend Intern",
      company: "Swiggy",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["React", "TypeScript", "HTML", "CSS"],
      source: "Indeed",
      postedDaysAgo: 3,
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://careers.swiggy.com/jobs/job-004",
      description:
        "Work on UI components used across consumer surfaces.\nImplement responsive layouts with strong accessibility.\nCollaborate with designers to polish interaction details.\nWrite unit tests for critical components.",
    },
    {
      id: "job-005",
      title: "QA Intern",
      company: "Infosys",
      location: "Mysuru",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["Testing", "Jira", "Selenium", "Basics of SQL"],
      source: "Naukri",
      postedDaysAgo: 5,
      salaryRange: "₹15k–₹30k/month Internship",
      applyUrl: "https://careers.infosys.com/jobs/job-005",
      description:
        "Assist in test case design and execution.\nLearn defect triage and reporting with clear reproduction steps.\nSupport regression cycles for web applications.\nBuild fundamentals in automation under mentorship.",
    },
    {
      id: "job-006",
      title: "Data Analyst Intern",
      company: "CRED",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["SQL", "Excel", "Python", "Data Visualization"],
      source: "LinkedIn",
      postedDaysAgo: 4,
      salaryRange: "₹20k–₹35k/month Internship",
      applyUrl: "https://careers.cred.club/jobs/job-006",
      description:
        "Support analytics for growth and engagement initiatives.\nWrite SQL to build reliable dashboards.\nWork with stakeholders to define clear metrics.\nDocument assumptions and data definitions.",
    },

    {
      id: "job-007",
      title: "Java Developer (0-1)",
      company: "Wipro",
      location: "Hyderabad",
      mode: "Onsite",
      experience: "0-1",
      skills: ["Java", "Spring Boot", "REST APIs", "SQL"],
      source: "Naukri",
      postedDaysAgo: 6,
      salaryRange: "3–5 LPA",
      applyUrl: "https://careers.wipro.com/jobs/job-007",
      description:
        "Develop and maintain Java microservices for enterprise clients.\nImplement API endpoints and basic validations.\nWork closely with senior engineers on code reviews.\nParticipate in defect fixes and release cycles.",
    },
    {
      id: "job-008",
      title: "Python Developer (Fresher)",
      company: "Cognizant",
      location: "Chennai",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Python", "Flask", "SQL", "Git"],
      source: "Indeed",
      postedDaysAgo: 7,
      salaryRange: "3–5 LPA",
      applyUrl: "https://careers.cognizant.com/jobs/job-008",
      description:
        "Build small backend services and internal tooling.\nWrite clean Python code with basic tests.\nCollaborate with QA and DevOps for deployments.\nLearn logging, monitoring, and incident basics.",
    },
    {
      id: "job-009",
      title: "React Developer (1-3)",
      company: "Freshworks",
      location: "Chennai",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["React", "TypeScript", "Redux", "Testing Library"],
      source: "LinkedIn",
      postedDaysAgo: 1,
      salaryRange: "6–10 LPA",
      applyUrl: "https://careers.freshworks.com/jobs/job-009",
      description:
        "Build product UI with consistent design patterns.\nOwn small features end-to-end with PM and design.\nImprove performance and reliability of critical screens.\nWrite tests and maintain component documentation.",
    },
    {
      id: "job-010",
      title: "Graduate Engineer Trainee",
      company: "Accenture",
      location: "Gurugram",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Java", "JavaScript", "SQL", "Problem Solving"],
      source: "Naukri",
      postedDaysAgo: 9,
      salaryRange: "3–5 LPA",
      applyUrl: "https://www.accenture.com/in-en/careers/job-010",
      description:
        "Join a technology team delivering client solutions.\nContribute to development and testing tasks.\nLearn agile ceremonies and engineering discipline.\nWork under guidance with clear milestones.",
    },

    {
      id: "job-011",
      title: "SDE Intern",
      company: "Amazon",
      location: "Bengaluru",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["DSA", "Java", "Linux", "System Design Basics"],
      source: "LinkedIn",
      postedDaysAgo: 2,
      salaryRange: "₹30k–₹40k/month Internship",
      applyUrl: "https://www.amazon.jobs/en/jobs/job-011",
      description:
        "Work on customer-impacting systems with strong engineering rigor.\nDeliver small scoped features with high quality.\nWrite tests and follow code review best practices.\nLearn operational excellence and metrics.",
    },
    {
      id: "job-012",
      title: "Junior Backend Developer",
      company: "PhonePe",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["Java", "Spring Boot", "MySQL", "Kafka"],
      source: "Indeed",
      postedDaysAgo: 0,
      salaryRange: "10–18 LPA",
      applyUrl: "https://careers.phonepe.com/jobs/job-012",
      description:
        "Build services for payments and risk workflows.\nDesign APIs with reliability and scale in mind.\nAdd observability with logs, metrics, and traces.\nCollaborate across teams to ship safely.",
    },
    {
      id: "job-013",
      title: "QA Engineer (0-1)",
      company: "Capgemini",
      location: "Mumbai",
      mode: "Hybrid",
      experience: "0-1",
      skills: ["Manual Testing", "API Testing", "Jira", "SQL"],
      source: "Naukri",
      postedDaysAgo: 8,
      salaryRange: "3–5 LPA",
      applyUrl: "https://www.capgemini.com/in-en/careers/job-013",
      description:
        "Execute functional and regression test suites.\nWrite clear bug reports with reproducible steps.\nSupport API testing using tools like Postman.\nWork closely with developers to validate fixes.",
    },
    {
      id: "job-014",
      title: "Data Analyst (1-3)",
      company: "Paytm",
      location: "Noida",
      mode: "Onsite",
      experience: "1-3",
      skills: ["SQL", "Python", "Tableau", "Analytics"],
      source: "Indeed",
      postedDaysAgo: 6,
      salaryRange: "6–10 LPA",
      applyUrl: "https://paytm.com/careers/job-014",
      description:
        "Analyze funnel performance and user engagement.\nBuild dashboards with consistent metric definitions.\nRun deep dives and share crisp insights.\nPartner with teams to track experiments.",
    },

    {
      id: "job-015",
      title: "Frontend Intern",
      company: "Zoho",
      location: "Chennai",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["JavaScript", "HTML", "CSS", "Basics of React"],
      source: "Naukri",
      postedDaysAgo: 4,
      salaryRange: "₹15k–₹30k/month Internship",
      applyUrl: "https://www.zoho.com/careers/job-015.html",
      description:
        "Build UI screens for business products with attention to detail.\nWork on bug fixes and small enhancements.\nLearn component-driven development and reviews.\nFollow coding standards and accessibility basics.",
    },
    {
      id: "job-016",
      title: "SDE Intern",
      company: "Juspay",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Java", "SQL", "Git", "Problem Solving"],
      source: "LinkedIn",
      postedDaysAgo: 1,
      salaryRange: "₹20k–₹40k/month Internship",
      applyUrl: "https://careers.juspay.in/jobs/job-016",
      description:
        "Contribute to reliable payment flows and internal tools.\nImplement features with strong correctness focus.\nWork with mentors to learn performance tuning.\nWrite short documentation for changes.",
    },
    {
      id: "job-017",
      title: "Oracle Developer (0-1)",
      company: "Oracle",
      location: "Hyderabad",
      mode: "Onsite",
      experience: "0-1",
      skills: ["SQL", "PL/SQL", "Data Modeling", "Debugging"],
      source: "Indeed",
      postedDaysAgo: 10,
      salaryRange: "6–10 LPA",
      applyUrl: "https://www.oracle.com/in/corporate/careers/job-017",
      description:
        "Work on database-driven backend modules.\nWrite and optimize queries for performance.\nSupport integration testing and bug fixing.\nMaintain clear documentation and change logs.",
    },
    {
      id: "job-018",
      title: "SAP Analyst (Fresher)",
      company: "SAP",
      location: "Bengaluru",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Business Analysis", "SQL Basics", "Documentation", "Communication"],
      source: "LinkedIn",
      postedDaysAgo: 7,
      salaryRange: "6–10 LPA",
      applyUrl: "https://jobs.sap.com/job-018",
      description:
        "Support requirements gathering and functional analysis.\nWork with engineers to clarify user workflows.\nCreate clear documentation and acceptance criteria.\nLearn enterprise product practices and processes.",
    },

    // Believable startups + remaining roles (fill up to 60)
    {
      id: "job-019",
      title: "Junior Backend Developer",
      company: "NimbleStack",
      location: "Bengaluru",
      mode: "Remote",
      experience: "1-3",
      skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
      source: "LinkedIn",
      postedDaysAgo: 3,
      salaryRange: "6–10 LPA",
      applyUrl: "https://nimblestack.in/careers/job-019",
      description:
        "Build APIs for workflow automation products.\nWrite clean service code with reliable tests.\nImprove performance of background processing.\nWork async with crisp communication.",
    },
    {
      id: "job-020",
      title: "React Developer (1-3)",
      company: "ByteBloom",
      location: "Mumbai",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["React", "TypeScript", "CSS", "APIs"],
      source: "Indeed",
      postedDaysAgo: 2,
      salaryRange: "6–10 LPA",
      applyUrl: "https://bytebloom.io/jobs/job-020",
      description:
        "Own UI surfaces for an internal admin platform.\nImplement components with consistent spacing and type.\nCoordinate with backend to define API contracts.\nShip improvements weekly with clear changelogs.",
    },
  ];

  // Programmatically extend to 60 with realistic variations (deterministic)
  const companies = [
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
    "Capgemini",
    "Cognizant",
    "IBM",
    "Oracle",
    "SAP",
    "Dell",
    "Amazon",
    "Flipkart",
    "Swiggy",
    "Razorpay",
    "PhonePe",
    "Paytm",
    "Zoho",
    "Freshworks",
    "Juspay",
    "CRED",
    "ClearTax",
    "Postman",
    "BrowserStack",
    "Groww",
    "Meesho",
    "Ola",
    "Zerodha",
    "InMobi",
    "Chargebee",
    "Hotstar",
    "FinBox",
    "SprintLabs",
    "Pinecone Systems",
    "LatticeWorks",
    "QuantaHire",
    "CodeSutra",
  ];
  const locations = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Gurugram", "Noida", "Mumbai", "Delhi NCR", "Kolkata", "Ahmedabad"];
  const modes = ["Remote", "Hybrid", "Onsite"];
  const exps = ["Fresher", "0-1", "1-3", "3-5"];
  const sources = ["LinkedIn", "Naukri", "Indeed"];
  const salary = ["3–5 LPA", "6–10 LPA", "10–18 LPA", "₹15k–₹40k/month Internship"];
  const titles = [
    "Graduate Engineer Trainee",
    "Junior Backend Developer",
    "Python Developer (Fresher)",
    "Java Developer (0-1)",
    "React Developer (1-3)",
    "QA Intern",
    "Frontend Intern",
    "Data Analyst Intern",
    "SDE Intern",
  ];
  const skillPool = ["Java", "Python", "React", "TypeScript", "SQL", "Node.js", "Spring Boot", "REST APIs", "Git", "Docker", "Selenium", "Excel", "Kafka", "Postman"];

  function pick(arr, i) {
    return arr[i % arr.length];
  }
  function pickMany(arr, start, count) {
    const out = [];
    for (let j = 0; j < count; j++) out.push(arr[(start + j * 3) % arr.length]);
    return Array.from(new Set(out));
  }
  function descFor(title, company) {
    return (
      `Join ${company} to work on well-scoped engineering tasks.\n` +
      `Build and improve features related to ${title.toLowerCase()} responsibilities.\n` +
      "Write maintainable code with reviews and basic testing.\n" +
      "Collaborate cross-functionally and document decisions.\n" +
      "Learn production discipline: logging, monitoring, and debugging."
    );
  }

  let n = jobs.length;
  while (n < 60) {
    const i = n + 1;
    const company = pick(companies, i);
    const title = pick(titles, i * 2);
    const location = pick(locations, i * 5);
    const mode = pick(modes, i * 7);
    const experience = pick(exps, i * 11);
    const source = pick(sources, i * 13);
    const postedDaysAgo = (i * 3) % 11; // 0–10
    const salaryRange = pick(salary, i * 17);
    const skills = pickMany(skillPool, i * 19, 4);

    jobs.push({
      id: `job-${String(i).padStart(3, "0")}`,
      title,
      company,
      location,
      mode,
      experience,
      skills,
      source,
      postedDaysAgo,
      salaryRange,
      applyUrl: `https://jobs.${company.toLowerCase().replace(/\s+/g, "")}.in/apply/${String(i).padStart(3, "0")}`,
      description: descFor(title, company),
    });
    n++;
  }

  // Expose globally for the router (no bundler)
  window.KN_JOBS = jobs;
})();

