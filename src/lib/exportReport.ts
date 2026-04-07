import jsPDF from "jspdf";
import type { AnalyticsData } from "@/hooks/useWritingAnalytics";

export function exportReportPDF(analytics: AnalyticsData, text: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const primaryColor: [number, number, number] = [20, 150, 120];
  const darkColor: [number, number, number] = [30, 30, 40];
  const mutedColor: [number, number, number] = [120, 120, 130];
  const scoreColors: Record<string, [number, number, number]> = {
    human: [40, 160, 100],
    uncertain: [210, 160, 40],
    ai: [210, 70, 70],
  };

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VI Notes Report", 14, 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
  y = 48;

  // Score section
  const sc = scoreColors[analytics.scoreLabel] || mutedColor;
  doc.setFillColor(sc[0], sc[1], sc[2]);
  doc.roundedRect(14, y, pageWidth - 28, 28, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${analytics.score}`, 24, y + 18);
  doc.setFontSize(11);
  doc.text(`/ 100  —  ${analytics.scoreLabel === "human" ? "Likely Human" : analytics.scoreLabel === "ai" ? "Likely AI" : "Uncertain"}`, 48, y + 18);
  y += 38;

  // Helper for section titles
  const sectionTitle = (title: string) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setTextColor(...primaryColor);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 2;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;
  };

  // Helper for stat rows
  const statRow = (label: string, value: string | number) => {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...mutedColor);
    doc.text(label, 18, y);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), 90, y);
    y += 7;
  };

  // Typing Behavior
  sectionTitle("Typing Behavior");
  statRow("Words Per Minute", analytics.wpm);
  statRow("Avg Keystroke (ms)", analytics.avgKeystrokeMs);
  statRow("Short Pauses", analytics.shortPauses);
  statRow("Long Pauses", analytics.longPauses);
  statRow("Edit Count", analytics.editCount);
  statRow("Edit Ratio", analytics.editRatio);
  y += 4;

  // Paste Activity
  sectionTitle("Paste Activity");
  statRow("Paste Events", analytics.pasteCount);
  statRow("Characters Pasted", analytics.pastedChars);
  if (analytics.pasteEvents.length > 0) {
    analytics.pasteEvents.slice(0, 5).forEach((pe, i) => {
      statRow(`  Paste #${i + 1}`, `Position ${pe.position}–${pe.endPosition} (${pe.length} chars)`);
    });
  }
  y += 4;

  // Text Analysis
  sectionTitle("Text Analysis");
  statRow("Word Count", analytics.wordCount);
  statRow("Character Count", analytics.charCount);
  statRow("Sentences", analytics.sentenceCount);
  statRow("Paragraphs", analytics.paragraphCount);
  statRow("Session Duration", `${Math.floor(analytics.sessionDuration / 60)}m ${analytics.sessionDuration % 60}s`);
  y += 4;

  // Suspicious Activity
  if (analytics.suspiciousItems.length > 0) {
    sectionTitle("Suspicious Activity");
    analytics.suspiciousItems.forEach((item) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setTextColor(item.severity === "high" ? 210 : 180, item.severity === "high" ? 60 : 140, item.severity === "high" ? 60 : 30);
      doc.setFont("helvetica", "normal");
      doc.text(`⚠  ${item.message}`, 18, y);
      y += 7;
    });
    y += 4;
  }

  // Explanations
  sectionTitle("Why This Score?");
  analytics.explanations.forEach((exp) => {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    doc.text(`•  ${exp}`, 18, y);
    y += 7;
  });
  y += 6;

  // Written Text Preview
  if (text.trim().length > 0) {
    sectionTitle("Written Text (Preview)");
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.setFont("helvetica", "normal");
    const preview = text.length > 1500 ? text.slice(0, 1500) + "..." : text;
    const lines = doc.splitTextToSize(preview, pageWidth - 36);
    lines.forEach((line: string) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 18, y);
      y += 5;
    });
  }

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text("VI Notes — AI Content Detection Report", 14, doc.internal.pageSize.getHeight() - 10);

  doc.save("writeguard-report.pdf");
}
