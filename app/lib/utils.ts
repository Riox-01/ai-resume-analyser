import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
    " " +
    sizes[i]
  );
}

export const generateUUID = () => crypto.randomUUID();

export const validateResumeFile = (
  file: File,
  extractedText: string
) => {

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    return "Only PDF or DOC/DOCX resume files are allowed.";
  }

  // File size validation (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return "Resume must be under 5MB.";
  }

  // Empty or unreadable resume check
  if (!extractedText || extractedText.trim().length < 100) {
    return "Resume content is too short or unreadable.";
  }

  // Resume keyword validation
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "internship",
    "developer",
    "work",
    "university",
    "summary",
    "certifications",
  ];

  const text = extractedText.toLowerCase();

  let matchedKeywords = 0;

  resumeKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      matchedKeywords++;
    }
  });

  if (matchedKeywords < 3) {
    return "This file does not appear to be a valid resume.";
  }

  return null;
};