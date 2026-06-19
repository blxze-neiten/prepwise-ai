"use client";

import { useState } from "react";
import { BookOpen, Calendar, ListChecks, Loader2, Sparkles } from "lucide-react";
import { StudyFormData } from "@/types";

interface StudyFormProps {
  onPlanGenerated: (plan: {
    subject: string;
    topics: string;
    exam_date: string;
    schedule: string;
    daysUntilExam: number;
  }) => void;
}

export default function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const [formData, setFormData] = useState<StudyFormData>({
    subject: "",
    topics: "",
    examDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          topics: formData.topics,
          examDate: formData.examDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      onPlanGenerated({
        subject: formData.subject,
        topics: formData.topics,
        exam_date: formData.examDate,
        schedule: data.schedule,
        daysUntilExam: data.daysUntilExam,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your Study Plan
          </h2>
          <p className="text-gray-500 mt-2">
            Enter your details and let AI build your perfect schedule
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-500" />
                Subject
              </span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Physics, History"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="topics"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-sky-500" />
                Topics to Cover
              </span>
            </label>
            <textarea
              id="topics"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., Algebra, Calculus, Geometry, Trigonometry"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate topics with commas
            </p>
          </div>

          <div>
            <label
              htmlFor="examDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                Exam Date
              </span>
            </label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Study Plan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}