"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { StudyPlan } from "@/types";
import {
  ArrowLeft,
  Library,
  Trash2,
  Calendar,
  BookOpen,
  Loader2,
} from "lucide-react";

export default function PlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("study_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("study_plans").delete().eq("id", id);

    if (!error) {
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    }
    setDeleting(null);
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
            href="/"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New Plan
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Study Plans</h1>
        <p className="text-gray-600 mb-8">
          All your AI-generated study schedules in one place
        </p>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading your plans...</span>
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No saved plans yet
            </h3>
            <p className="text-gray-500 mb-6">
              Generate your first study plan and save it here!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Create Your First Plan
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="grid gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-4 text-white flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <div>
                      <h3 className="font-bold text-lg">{plan.subject}</h3>
                      <p className="text-sky-100 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Exam: {plan.exam_date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => plan.id && handleDelete(plan.id)}
                    disabled={deleting === plan.id}
                    className="bg-white/20 hover:bg-red-500/50 disabled:opacity-50 text-white p-2 rounded-lg transition-all cursor-pointer"
                    title="Delete plan"
                  >
                    {deleting === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                      Topics
                    </span>
                    <p className="text-gray-700 mt-2">{plan.topics}</p>
                  </div>
                  <div
                    className="prose prose-blue max-w-none border-t border-gray-100 pt-4"
                    dangerouslySetInnerHTML={{ __html: plan.schedule }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}