export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Edwyz didn't just build us a model — they rebuilt how our whole team thinks about data. The predictive maintenance platform paid for itself in under six months.",
    author: "Maria Chen",
    role: "VP of Operations",
    company: "Global Manufacturing Group",
    rating: 5,
  },
  {
    quote: "The fraud detection system they built catches things our old rules engine never could, with a fraction of the false positives. Genuinely best-in-class work.",
    author: "David Okafor",
    role: "Head of Risk",
    company: "Fintech Payments Platform",
    rating: 5,
  },
  {
    quote: "Their AI agent now handles more than half our support volume — and customers can't tell the difference in quality. That's the bar we wanted.",
    author: "Priya Nair",
    role: "Director of Customer Success",
    company: "SaaS Platform",
    rating: 5,
  },
];
