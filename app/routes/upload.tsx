import { type FormEvent, useState } from "react";
import Navbar from "~/components/navbar";
import FileUploader from "~/components/Fileuploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/consatnts";

const Upload = () => {

  const { fs, ai, kv } = usePuterStore();

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

      // =========================
      // Upload Resume
      // =========================

      setStatusText("Uploading resume...");

      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile) {

        setStatusText("Failed to upload resume");

        return;
      }

      // =========================
      // Convert PDF To Image
      // =========================

      setStatusText("Generating resume preview...");

      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {

        setStatusText("Failed to generate preview");

        return;
      }

      // =========================
      // Upload Preview Image
      // =========================

      setStatusText("Uploading preview image...");

      const uploadedImage = await fs.upload([imageFile.file]);

      if (!uploadedImage) {

        setStatusText("Failed to upload image");

        return;
      }

      // =========================
      // Generate ID
      // =========================

      const uuid = generateUUID();

      // =========================
      // Initial Resume Data
      // =========================

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
      };

      // =========================
      // Save Initial Data
      // =========================

      await kv.set(
        `resume:${uuid}`,
        JSON.stringify(data)
      );

      // =========================
      // AI Analysis
      // =========================

      setStatusText("Analyzing resume with AI...");

      const feedback = await ai.feedback(

        uploadedFile.path,

        prepareInstructions({

          jobTitle: String(jobTitle),

          jobDescription: String(jobDescription),

          AIResponseFormat: `
{
  "overallScore": 75,

  "ATS": {
    "score": 70,
    "tips": [
      {
        "type": "improve",
        "tip": "Missing measurable achievements",
        "explanation": "Projects and experience lack quantified impact and engineering metrics."
      }
    ]
  },

  "toneAndStyle": {
    "score": 65,
    "tips": [
      {
        "type": "improve",
        "tip": "Weak action verbs",
        "explanation": "Bullet points use passive and generic wording instead of impactful engineering language."
      }
    ]
  },

  "content": {
    "score": 60,
    "tips": [
      {
        "type": "improve",
        "tip": "Projects lack technical depth",
        "explanation": "Projects appear surface-level and do not demonstrate advanced engineering complexity."
      }
    ]
  },

  "structure": {
    "score": 72,
    "tips": [
      {
        "type": "good",
        "tip": "Readable layout",
        "explanation": "Resume sections are organized clearly and easy to scan."
      }
    ]
  },

  "skills": {
    "score": 68,
    "tips": [
      {
        "type": "improve",
        "tip": "Skill section too generic",
        "explanation": "Skills lack specialization and modern industry-relevant tooling."
      }
    ]
  }
}
`,
        })
      );

      console.log("FULL AI OBJECT:", feedback);

      if (!feedback) {

        setStatusText("AI analysis failed");

        return;
      }

      // =========================
      // Extract AI Response
      // =========================

      const feedbackText =
        typeof feedback === "string"
          ? feedback
          : feedback?.message?.content?.[0]?.text ||
            feedback?.message?.content ||
            "";

      console.log("RAW AI RESPONSE:", feedbackText);

      // =========================
      // Parse JSON
      // =========================

      let parsedFeedback;

      try {

        parsedFeedback = JSON.parse(feedbackText);

      } catch (error) {

        console.error("JSON Parse Error:", error);

        setStatusText("Invalid AI response");

        return;
      }

      console.log("PARSED FEEDBACK:", parsedFeedback);

      // =========================
      // Validate Response
      // =========================

      if (
        !parsedFeedback ||
        !parsedFeedback.overallScore ||
        !parsedFeedback.ATS ||
        !parsedFeedback.toneAndStyle ||
        !parsedFeedback.content ||
        !parsedFeedback.structure ||
        !parsedFeedback.skills
      ) {

        setStatusText("Incomplete AI response");

        return;
      }

      // =========================
      // Save Feedback
      // =========================

      data.feedback = parsedFeedback;

      await kv.set(
        `resume:${uuid}`,
        JSON.stringify(data)
      );

      console.log("FINAL SAVED DATA:", data);

      setStatusText("Analysis complete!");

      // =========================
      // Redirect
      // =========================

      setTimeout(() => {

        navigate(`/resume/${uuid}`);

      }, 1000);

    } catch (error) {

      console.error(error);

      setStatusText("Something went wrong");

    } finally {

      setIsProcessing(false);

    }
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const form =
      e.currentTarget.closest("form");

    if (!form) return;

    const formData = new FormData(form);

    const companyName =
      formData.get("company-name") as string;

    const jobTitle =
      formData.get("job-title") as string;

    const jobDescription =
      formData.get("job-description") as string;

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

          <h1>
            Smart feedback for your dream job
          </h1>

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
              Drop your resume for an ATS score
              and improvement tips
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