import { type FormEvent, useState } from "react";
import Navbar from "~/components/navbar";
import FileUploader from "~/components/Fileuploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/consatnts";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      // Upload PDF
      setStatusText("Uploading the file...");

      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile) {
        setStatusText("Error: Failed to upload file");
        return;
      }

      // Convert PDF to image
      setStatusText("Converting PDF to image...");

      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {
        setStatusText("Error: Failed to convert PDF");
        return;
      }

      // Upload image
      setStatusText("Uploading image...");

      const uploadedImage = await fs.upload([imageFile.file]);

      if (!uploadedImage) {
        setStatusText("Error: Failed to upload image");
        return;
      }

      // Generate unique ID
      const uuid = generateUUID();

      // Initial data
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
      };

      // Save initial state
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // AI Analysis
      setStatusText("Analyzing resume with AI...");

      const feedback = await ai.feedback(
        uploadedFile.path,

        prepareInstructions({
          jobTitle: String(jobTitle),
          jobDescription: String(jobDescription),

          AIResponseFormat: `
{
  "summary": "string",

  "ATS": {
    "score": 85,
    "tips": [
      {
        "type": "good",
        "tip": "string",
        "explanation": "string"
      }
    ]
  },

  "toneAndStyle": {
    "score": 80,
    "tips": [
      {
        "type": "good",
        "tip": "string",
        "explanation": "string"
      }
    ]
  },

  "content": {
    "score": 78,
    "tips": [
      {
        "type": "good",
        "tip": "string",
        "explanation": "string"
      }
    ]
  },

  "structure": {
    "score": 82,
    "tips": [
      {
        "type": "good",
        "tip": "string",
        "explanation": "string"
      }
    ]
  },

  "skills": {
    "score": 75,
    "tips": [
      {
        "type": "good",
        "tip": "string",
        "explanation": "string"
      }
    ]
  }
}
`,
        })
      );

      console.log("FULL AI OBJECT:", feedback);

      if (!feedback) {
        setStatusText("Error: AI analysis failed");
        return;
      }

      // Extract AI response safely
      const feedbackText =
        typeof feedback === "string"
          ? feedback
          : feedback?.message?.content?.[0]?.text ||
            feedback?.message?.content ||
            "";

      console.log("RAW AI RESPONSE:", feedbackText);

      // Parse JSON safely
      let parsedFeedback;

      try {
        parsedFeedback = JSON.parse(feedbackText);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        setStatusText("Error: Invalid AI response");
        return;
      }

      console.log("PARSED FEEDBACK:", parsedFeedback);

      // Save parsed feedback
      data.feedback = parsedFeedback;

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      console.log("FINAL SAVED DATA:", data);

      setStatusText("Analysis complete! Redirecting...");

      // Navigate to review page
      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error(error);
      setStatusText("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget.closest("form");

    if (!form) return;

    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;

    const jobTitle = formData.get("job-title") as string;

    const jobDescription = formData.get(
      "job-description"
    ) as string;

    if (!file) {
      alert("Please upload a resume");
      return;
    }

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">

          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>

              <img
                src="/images/resume-scan.gif"
                className="w-full"
                alt="loading"
              />
            </>
          ) : (
            <h2>
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >

              <div className="form-div">
                <label htmlFor="company-name">
                  Company Name
                </label>

                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">
                  Job Title
                </label>

                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">
                  Job Description
                </label>

                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">
                  Upload Resume
                </label>

                <FileUploader
                  onFileSelect={handleFileSelect}
                />
              </div>

              <button
                className="primary-button"
                type="submit"
              >
                Analyze Resume
              </button>

            </form>
          )}

        </div>
      </section>
    </main>
  );
};

export default Upload;