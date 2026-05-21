import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
  { title: "Resuvault | Review" },
  {
    name: "description",
    content: "Detailed overview of your resume",
  },
]);

const Resume = () => {

  const {
    auth,
    isLoading,
    fs,
    kv,
  } = usePuterStore();

  const { id } = useParams();

  const navigate = useNavigate();

  const [imageUrl, setImageUrl] =
    useState("");

  const [resumeUrl, setResumeUrl] =
    useState("");

  const [feedback, setFeedback] =
    useState<Feedback | null>(null);

  const [loadingFailed, setLoadingFailed] =
    useState(false);

  useEffect(() => {

    if (
      !isLoading &&
      !auth.isAuthenticated
    ) {

      navigate(
        `/auth?next=/resume/${id}`
      );

    }

  }, [
    isLoading,
    auth.isAuthenticated,
    id,
    navigate,
  ]);

  useEffect(() => {

    let imageObjectUrl = "";
    let pdfObjectUrl = "";

    const loadResume = async () => {

      try {

        const resume =
          await kv.get(`resume:${id}`);

        if (!resume) {

          console.error(
            "Resume not found"
          );

          setLoadingFailed(true);

          return;
        }

        const data = JSON.parse(resume);

        // =========================
        // Load PDF
        // =========================

        const resumeBlob =
          await fs.read(data.resumePath);

        if (resumeBlob) {

          const pdfBlob = new Blob(
            [resumeBlob],
            {
              type: "application/pdf",
            }
          );

          pdfObjectUrl =
            URL.createObjectURL(pdfBlob);

          setResumeUrl(pdfObjectUrl);
        }

        // =========================
        // Load Preview Image
        // =========================

        const imageBlob =
          await fs.read(data.imagePath);

        if (imageBlob) {

          imageObjectUrl =
            URL.createObjectURL(imageBlob);

          setImageUrl(imageObjectUrl);
        }

        // =========================
        // Load Feedback
        // =========================

        if (data.feedback) {

          setFeedback(data.feedback);

        } else {

          setLoadingFailed(true);

        }

        console.log(
          "LOADED DATA:",
          data
        );

      } catch (error) {

        console.error(
          "Error loading resume:",
          error
        );

        setLoadingFailed(true);

      }
    };

    loadResume();

    return () => {

      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }

      if (pdfObjectUrl) {
        URL.revokeObjectURL(pdfObjectUrl);
      }

    };

  }, [id, fs, kv]);

  return (

    <main className="!pt-0 overflow-x-hidden">

      {/* Navigation */}

      <nav className="resume-nav px-4 sm:px-6 lg:px-10">

        <Link
          to="/"
          className="back-button"
        >

          <img
            src="/icons/back.svg"
            alt="back"
            className="w-2.5 h-2.5"
          />

          <span className="text-gray-800 text-sm font-semibold">

            Back to Homepage

          </span>

        </Link>

      </nav>

      {/* Main Layout */}

      <div className="flex flex-col lg:flex-row w-full gap-6 px-4 sm:px-6 lg:px-10 pb-10">

        {/* Resume Preview */}

        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover lg:h-screen lg:sticky lg:top-0 items-center justify-center rounded-3xl">

          {imageUrl && resumeUrl && (

            <div className="animate-in fade-in duration-1000 gradient-border w-full max-w-2xl mx-auto overflow-hidden rounded-2xl">

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >

                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                  alt="resume preview"
                />

              </a>

            </div>

          )}

        </section>

        {/* Feedback Section */}

        <section className="feedback-section w-full px-1 sm:px-2">

          <h2 className="text-3xl sm:text-4xl !text-black font-bold break-words">

            Resume Review

          </h2>

          {feedback !== null ? (

            <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-1000 mt-6">

              {/* Summary */}

              <Summary feedback={feedback} />

              {/* ATS */}

              <ATS
                score={
                  feedback?.ATS?.score || 0
                }
                suggestions={
                  feedback?.ATS?.tips || []
                }
              />

              {/* Details */}

              <Details feedback={feedback} />

            </div>

          ) : loadingFailed ? (

            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 mt-6">

              Failed to load resume analysis.

            </div>

          ) : (

            <img
              src="/images/resume-scan-2.gif"
              className="w-full max-w-sm mx-auto"
              alt="loading"
            />

          )}

        </section>

      </div>

    </main>
  );
};

export default Resume;