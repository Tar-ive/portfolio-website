"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Linkedin, Github, Download, GraduationCap, Briefcase, Award, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Saksham Adhikari</h1>
        <p className="text-xl text-muted-foreground mb-4">AI Researcher & Full-Stack Developer</p>
        
        {/* Contact Information */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            <Link href="https://www.linkedin.com/in/adhsaksham/" className="hover:text-foreground">
              LinkedIn
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>737-315-1963</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>pqo14@txstate.edu</span>
          </div>
          <div className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            <Link href="https://github.com/Tar-ive" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Education */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Texas State University (TXST)</h3>
                  <p className="text-sm text-muted-foreground">Bachelor of Science in Computer Information Systems</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2023 - Current</p>
                  <p className="text-sm text-muted-foreground">San Marcos, TX</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">GPA 4.0/4.0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Google</h3>
                <p className="text-sm font-medium text-blue-600">TPU Cloud Student Researcher</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">August 2025 - Current</p>
                <p className="text-sm text-muted-foreground">Remote</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Leading advanced TPU optimization research on Google Cloud TPU v6e architecture with contributions to the open-source vllm project</li>
              <li>• Architected multi-agent reinforcement learning system for power grid intelligence using 618-dimensional state space and 145-dimensional action space</li>
            </ul>
          </div>

          {/* TXST - Center of Analytics */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Center of Analytics and Data Science @ TXST</h3>
                <p className="text-sm font-medium text-blue-600">Student Programmer</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">July 2025 - Current</p>
                <p className="text-sm text-muted-foreground">San Marcos, TX</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Engineered full-stack researcher discovery tool using UMAP, semantic clustering, and LLMs processing 2,454 academic papers</li>
              <li>• Optimized data payload to 259KB, achieving sub-500ms load times for seamless interdisciplinary discovery</li>
              <li>• Architected full-scale DevOps lifecycle with CI/CD pipeline using GitHub Actions and Vercel</li>
            </ul>
          </div>

          {/* TXST - Software Development Intern */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Texas State University</h3>
                <p className="text-sm font-medium text-blue-600">Software Development Intern</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">May 2025 - July 2025</p>
                <p className="text-sm text-muted-foreground">Austin, TX</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Developed agentic AI systems for healthcare using GAIA framework with llama-nexus inference gateway</li>
              <li>• Optimized autonomous agent workflows with tool-use capabilities across multiple LLM models</li>
              <li>• Discovered 1 critical SQL injection vulnerability while validating system performance</li>
            </ul>
          </div>

          {/* Research Assistant */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Translational Health Research Center</h3>
                <p className="text-sm font-medium text-blue-600">Undergraduate Research Assistant</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">November 2024 - Current</p>
                <p className="text-sm text-muted-foreground">San Marcos, TX</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Engineered HIPAA-compliant Python NLP pipeline analyzing 619 patient interactions</li>
              <li>• Reduced data processing time by 40% managing 30k+ HIPAA-compliant patient data points</li>
              <li>• Delivered project 200% under budget (< $150 total cost) using AWS SageMaker</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Publications & Research */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Publications & Research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Co-Author: "Exploring rural women's healthcare access through social vulnerability profiles"</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Developed novel vulnerability profiling framework identifying 7 distinct subgroups of rural women</li>
              <li>• Engineered clustering pipeline achieving exceptional validation scores (Silhouette Score: 0.93, ARI: 1.0)</li>
              <li>• Executed advanced statistical validation using Generalized Linear Model (GLM) in Python</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Lead-Author: "QuantaFold: Scaling Protein Language Model Fine-tuning to 5000 Families"</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Achieved 78% training time reduction scaling ESM-2 fine-tuning to 400,000 sequences across 5,000 protein families</li>
              <li>• Reduced dataset size by 3.3x (1.34M → 400K sequences) while preserving statistical diversity</li>
              <li>• Demonstrated 97.9% accuracy on specialist tasks with 63.914 samples/second inference throughput</li>
              <li>• Research selected for poster presentation at SC25 (International Conference for High Performance Computing)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Awards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Awards & Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">TXST Datathon – 1st Place (2025)</h3>
              <p className="text-sm text-muted-foreground">Developed greedy parking space optimizer using TensorFlow</p>
            </div>
            <div>
              <h3 className="font-semibold">Novo Hacks – Best Design (2024)</h3>
              <p className="text-sm text-muted-foreground">Built foodbank app with AI agent optimization</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold">National Economics Olympiad - Gold Medalist (2022)</h3>
              <p className="text-sm text-muted-foreground">Business Case Analysis - Kathmandu, Nepal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholarships */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Scholarships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Texas State Merit Scholar (2023)</h3>
            <p className="text-sm text-muted-foreground">Full-tuition scholarship awarded to 15 students schoolwide for outstanding leadership</p>
          </div>
          <div>
            <h3 className="font-semibold">AKAEF Undergraduate Launch Scholar (2024)</h3>
            <p className="text-sm text-muted-foreground">$5,000 scholarship for technical potential and inclusive tech industry commitment</p>
          </div>
          <div>
            <h3 className="font-semibold">Merry Kone FitzPatrick Endowment Scholarship (2024)</h3>
            <p className="text-sm text-muted-foreground">$4,000 scholarship for honors excellence and inclusive campus community</p>
          </div>
          <div>
            <h3 className="font-semibold">Montgomery Endowment Web Service Scholarship (2024)</h3>
            <p className="text-sm text-muted-foreground">$2,000 scholarship for web service excellence and leadership</p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Python", "JavaScript", "JAX", "Rust", "SQL", "React", "HTML", "CSS", 
              "Git", "Linux", "Terraform", "TensorFlow", "OpenCV", "Swift", 
              "Node.js", "NLP", "PyTorch", "Docker", "AWS", "GCP"
            ].map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Documents */}
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/media/saksham_resume_2025.pdf" download>
            <Download className="mr-2 h-4 w-4" />
            Download Resume (PDF)
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/media/Saksham_CV.docx" download>
            <Download className="mr-2 h-4 w-4" />
            Download CV (DOCX)
          </Link>
        </Button>
      </div>
    </div>
  );
}