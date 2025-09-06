"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Linkedin, Github, Download, GraduationCap, Briefcase, Award, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Saksham Adhikari</h1>
        <p className="text-xl text-muted-foreground mb-4">AI Researcher & Full-Stack Developer</p>
        
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

      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/media/saksham_resume_2025.pdf" download>
            <Download className="mr-2 h-4 w-4" />
            Download Resume (PDF)
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/media/saksham.pdf" download>
            <Download className="mr-2 h-4 w-4" />
            Download CV (PDF)
          </Link>
        </Button>
      </div>
    </div>
  );
}