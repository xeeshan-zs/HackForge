import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "competitive-programming",
    name: "Competitive Programming",
    icon: "💻",
    description:
      "Solve algorithmic and problem-solving challenges under tight time constraints.",
    teamSize: "Solo / Duo",
    teamMemberLimit: 2,
    registrationFee: 500,
    eligibility: "University students",
    rules: [
      "Teams can be solo or duo only.",
      "Only standard libraries are allowed.",
      "Internet access is restricted to judge resources.",
    ],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design Challenge",
    icon: "🎨",
    description:
      "Design a polished mobile app experience based on a live challenge brief.",
    teamSize: "Team of 2",
    teamMemberLimit: 2,
    registrationFee: 600,
    eligibility: "University students",
    rules: [
      "Exactly 2 participants per team.",
      "Submission must include wireframes and high-fidelity screens.",
      "Prototype handoff in Figma is required.",
    ],
  },
  {
    id: "cybersecurity-ctf",
    name: "Cybersecurity / CTF",
    icon: "🛡️",
    description:
      "Compete through practical security puzzles and Capture The Flag tasks.",
    teamSize: "Solo",
    teamMemberLimit: 1,
    registrationFee: 400,
    eligibility: "University students",
    rules: [
      "Single participant only.",
      "No attacks on infrastructure outside competition scope.",
      "Flags must be submitted before deadline.",
    ],
  },
  {
    id: "ai-ml-showcase",
    name: "AI/ML Project Showcase",
    icon: "🤖",
    description:
      "Present a trained ML model or AI solution with impact and technical clarity.",
    teamSize: "Team of 2-3",
    teamMemberLimit: 3,
    registrationFee: 700,
    eligibility: "University students",
    rules: [
      "Team size must be 2 or 3.",
      "Demo and short technical presentation are mandatory.",
      "Projects should include methodology and evaluation metrics.",
    ],
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: "🌐",
    description:
      "Build a complete full-stack web experience during the timed challenge.",
    teamSize: "Team of 2",
    teamMemberLimit: 2,
    registrationFee: 650,
    eligibility: "University students",
    rules: [
      "Exactly 2 members per team.",
      "Project must include both frontend and backend behavior.",
      "Final source code and demo link submission required.",
    ],
  },
  {
    id: "hardware-iot",
    name: "Hardware / IoT",
    icon: "🔌",
    description:
      "Create physical computing and IoT solutions using sensors and controllers.",
    teamSize: "Team of 2-3",
    teamMemberLimit: 3,
    registrationFee: 750,
    eligibility: "University students",
    rules: [
      "Team size must be 2 or 3.",
      "Teams bring core hardware kits unless otherwise announced.",
      "Safety protocols must be followed in lab spaces.",
    ],
  },
  {
    id: "business-pitch",
    name: "Business Pitch",
    icon: "📈",
    description:
      "Pitch a high-potential tech startup concept to a judging panel.",
    teamSize: "Team of 3-4",
    teamMemberLimit: 4,
    registrationFee: 800,
    eligibility: "University students",
    rules: [
      "Team size must be 3 or 4.",
      "Pitch deck and timed oral presentation are required.",
      "Judging includes feasibility, innovation, and market fit.",
    ],
  },
];

