import { FileText, Briefcase, Star, PenTool } from "lucide-react";

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Smart Job Matching",
    description: "AI-powered job recommendations based on your skills and preferences",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Resume Builder",
    description: "Create professional resumes with our intelligent builder",
  },
  {
    icon: <PenTool className="h-8 w-8 text-primary" />,
    title: "Cover Letter Assistant",
    description: "Generate tailored cover letters for each application",
  },
  {
    icon: <Star className="h-8 w-8 text-premium" />,
    title: "Premium Features",
    description: "Access advanced AI tools and priority job listings",
  },
];

export const Features = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Jobedin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow animate-float"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};