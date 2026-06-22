export type JobListing = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
};

export const jobListings: JobListing[] = [
  { slug: "senior-ml-engineer", title: "Senior Machine Learning Engineer", department: "AI & Data", location: "Remote", type: "Full-time" },
  { slug: "ai-solutions-architect", title: "AI Solutions Architect", department: "AI & Data", location: "Remote", type: "Full-time" },
  { slug: "senior-fullstack-engineer", title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { slug: "devops-engineer", title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { slug: "product-designer", title: "Product Designer", department: "Product", location: "Remote", type: "Full-time" },
  { slug: "technical-recruiter", title: "Technical Recruiter", department: "People", location: "Remote", type: "Contract" },
];
