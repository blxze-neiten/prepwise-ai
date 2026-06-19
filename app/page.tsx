"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StudyForm from "@/components/StudyForm";
import PlanCard from "@/components/PlanCard";
import { Library, ArrowRight } from "lucide-react";

export default function Home() {
  const [generatedPlan, setGeneratedPlan] = useState<{
    subject: string;
    topics: string;
    exam_date: string;
    schedule: string;
    daysUntilExam: number;
  } | null>(null);

  const handlePlanGenerated = (plan: {
    subject: string;
    topics: string;
    exam_date: string;
    schedule: string;
    daysUntilExam: number;
  }) => {
    setGeneratedPlan(plan);
    setTimeout(() => {
      document.getElementById("plan-result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    const { error } = await supabase.from("study_plans").insert({
      subject: generatedPlan.subject,
      topics: generatedPlan.topics,
      exam_date: generatedPlan.exam_date,
      schedule: generatedPlan.schedule,
    });

    if (error) {
      console.error("Save error:", error);
      throw new Error("Failed to save plan");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <Library className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PrepWise AI</span>
          </div>
          <Link
            href="/plans"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            View Saved Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your AI-Powered
            <span className="text-sky-600"> Study Planner</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your subject, topics, and exam date. Our AI will create a
            personalized day-by-day study schedule just for you.
          </p>
        </div>

        <StudyForm onPlanGenerated={handlePlanGenerated} />

        {generatedPlan && (
          <div id="plan-result" className="mt-12 max-w-4xl mx-auto">
            <PlanCard
              plan={{
                subject: generatedPlan.subject,
                topics: generatedPlan.topics,
                exam_date: generatedPlan.exam_date,
                schedule: generatedPlan.schedule,
              }}
              onSave={handleSavePlan}
            />
          </div>
        )}
      </div>
    </main>
  );
}