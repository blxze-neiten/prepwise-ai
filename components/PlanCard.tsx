"use client";

import { useState } from "react";
import { Save, Check, Calendar, BookOpen, Clock } from "lucide-react";
import { StudyPlan } from "@/types";

interface PlanCardProps {
  plan: StudyPlan;
  onSave: () => Promise<void>;
  isSaved?: boolean;
}

export default function PlanCard({ plan, onSave, isSaved = false }: PlanCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    await onSave();
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-8 py-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {plan.subject}
            </h2>
            <p className="text-sky-100 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Exam Date: {plan.exam_date}
            </p>
          </div>
          {!saved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              {saving ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Plan"}
            </button>
          )}
          {saved && (
            <span className="bg-green-500/20 text-green-100 px-4 py-2 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              Saved!
            </span>
          )}
        </div>
      </div>

      <div className="p-8">
        <div
          className="prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: plan.schedule }}
        />
      </div>
    </div>
  );
}