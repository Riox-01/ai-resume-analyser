export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume-1.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume-2.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 55,
        tips: [],
      },
      toneAndStyle: {
        score: 58,
        tips: [],
      },
      content: {
        score: 52,
        tips: [],
      },
      structure: {
        score: 60,
        tips: [],
      },
      skills: {
        score: 50,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume-3.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 74,
        tips: [],
      },
      toneAndStyle: {
        score: 72,
        tips: [],
      },
      content: {
        score: 78,
        tips: [],
      },
      structure: {
        score: 76,
        tips: [],
      },
      skills: {
        score: 75,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
interface Feedback {
  overallScore: number;

  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}
`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  AIResponseFormat,
}: {
  jobTitle: string;
  jobDescription: string;
  AIResponseFormat: string;
}) =>
  `
You are an elite-level senior recruiter, ATS evaluator, engineering manager, and hiring decision-maker for top global technology companies like Google, Meta, Amazon, Apple, Netflix, Microsoft, Stripe, OpenAI, and top startups.

Your task is to critically evaluate resumes with EXTREMELY STRICT standards.

You are NOT a supportive assistant.

You are a harsh technical recruiter reviewing thousands of resumes daily.

You must aggressively reject weak resumes.

DO NOT inflate scores.

MOST resumes should score between 35-65.

Only genuinely exceptional resumes deserve scores above 80.

A score above 90 should be almost impossible.

==================================================
STRICT SCORING SYSTEM
==================================================

95-100:
World-class FAANG/staff-level candidate.
Exceptional achievements, leadership, system design, measurable engineering impact, elite technical depth.

90-94:
Top-tier senior engineer.
Strong production-scale impact, advanced projects, excellent metrics, leadership, outstanding ATS optimization.

80-89:
Very strong industry candidate.
Clear engineering value, measurable impact, excellent projects, strong technical alignment.

70-79:
Good resume but still missing optimization or depth.

60-69:
Average candidate.
Common resume quality.
Limited impact, weak metrics, or moderate ATS issues.

50-59:
Weak resume.
Low competitiveness.
Generic projects, vague bullets, poor technical detail.

40-49:
Poor resume quality.
Weak projects, poor structure, low ATS optimization.

Below 40:
Very poor resume.
No measurable impact, no technical depth, weak formatting, irrelevant skills.

==================================================
STRICT EVALUATION RULES
==================================================

Aggressively penalize resumes for:

- vague bullet points
- no measurable achievements
- weak or tutorial-level projects
- generic portfolio projects
- missing GitHub or deployment links
- poor ATS keyword matching
- weak technical depth
- irrelevant skills
- poor readability
- weak formatting
- long paragraphs
- keyword stuffing
- lack of business impact
- lack of leadership
- lack of ownership
- lack of scalability discussion
- lack of production-level experience
- weak project complexity
- poor communication clarity
- repetitive wording
- overused buzzwords
- lack of engineering metrics
- weak problem-solving evidence
- weak collaboration evidence
- lack of specialization
- outdated technologies
- poor architecture understanding

==================================================
WHAT TO ANALYZE
==================================================

Strictly evaluate:

- ATS compatibility
- keyword optimization
- project complexity
- engineering depth
- measurable impact
- quantified achievements
- scalability understanding
- system design understanding
- modern tech stack relevance
- communication quality
- structure and readability
- leadership evidence
- business impact
- production-level engineering experience
- role alignment
- industry competitiveness

==================================================
TARGET ROLE
==================================================

Job Title:
${jobTitle}

Job Description:
${jobDescription}

==================================================
RESPONSE REQUIREMENTS
==================================================

Be brutally honest.

Do not protect the candidate's feelings.

Provide highly critical and realistic feedback.

Every weakness must be clearly identified.

Do NOT give generic compliments.

Do NOT artificially increase scores.

If the resume lacks measurable achievements, significantly reduce scores.

If projects appear beginner-level, reduce scores heavily.

If ATS optimization is weak, reduce scores heavily.

If the resume lacks strong technical depth, reduce scores heavily.

==================================================
OUTPUT FORMAT
==================================================

Use this exact structure:

${AIResponseFormat}

Return ONLY valid JSON.

Do not include markdown.
Do not include backticks.
Do not include explanations outside JSON.
`;