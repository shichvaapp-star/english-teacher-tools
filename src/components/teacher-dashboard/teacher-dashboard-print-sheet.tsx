"use client";

import React from "react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardPrintSheet({ c }: { c: TeacherDashboardController }) {
  const {
    filteredStudents,
    user,
  } = c;
  // Only rendered after the page's teacher sign-in guard.
  if (!user) return null;
  return (
    <>
      {/* -------------------------------------------------------------------
          PRINTABLE CLASS ROSTER VIEW (window.print())
          ------------------------------------------------------------------- */}
      <div className="hidden print:block p-8 space-y-6 bg-white text-black font-sans" dir="rtl">
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black">רשימת תלמידים וקודי כניסה למערכת</h1>
            <p className="text-sm mt-1 text-gray-700">
              {user.schoolName || "חטיבת ביניים"} &bull; מורה: <strong>{user.name}</strong>
            </p>
          </div>
          <div className="text-left" dir="ltr">
            <span className="text-xs text-gray-500 block">Class Roster</span>
            <span className="text-sm font-semibold text-gray-700">English Dept.</span>
          </div>
        </div>

        <table className="w-full border-collapse text-xs mt-4">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="p-2 text-right">#</th>
              <th className="p-2 text-right">שם התלמיד/ה (באנגלית)</th>
              <th className="p-2 text-right">כיתה</th>
              <th className="p-2 text-right">הקבצה</th>
              <th className="p-2 text-right">קוד PIN</th>
              <th className="p-2 text-right">חתימת תלמיד / הערות</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr key={s.id} className="border-b border-gray-200">
                <td className="p-2 text-gray-500">{idx + 1}</td>
                <td className="p-2 font-bold font-sans" dir="ltr">
                  {s.name}
                </td>
                <td className="p-2">{s.fullClass || "—"}</td>
                <td className="p-2">{s.group ? `הקבצה ${s.group}` : "—"}</td>
                <td className="p-2 font-mono font-bold text-sm tracking-wider" dir="ltr">
                  {s.pin}
                </td>
                <td className="p-2 border-b border-gray-200 w-44"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
