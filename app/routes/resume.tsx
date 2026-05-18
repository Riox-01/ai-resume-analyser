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
  const { auth, isLoading, fs, kv } = usePuterStore();

  const { id } = useParams();

  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, id, navigate]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);

        if (!resume) {
          console.error("Resume not found");
          return;
        }

        const data = JSON.parse(resume);

        // Load PDF
        const resumeBlob = await fs.read(data.resumePath);

        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], {
            type: "application/pdf",
          });

          const generatedResumeUrl =
            URL.createObjectURL(pdfBlob);

          setResumeUrl(generatedResumeUrl);
        }

        // Load Image
        const imageBlob = await fs.read(data.imagePath);

        if (imageBlob) {
          const generatedImageUrl =
            URL.createObjectURL(imageBlob);

          setImageUrl(generatedImageUrl);
        }

        // Load feedback
        if (data.feedback) {
          setFeedback(data.feedback);
        }

        console.log("LOADED DATA:", data);

      } catch (error) {
        console.error("Error loading resume:", error);
      }
    };

    loadResume();
  }, [id, fs, kv]);

  return (
    <main className="!pt-0">

      {/* Navigation */}
      <nav className="resume-nav">

        <Link to="/" className="back-button">

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

      <div className="flex flex-row w-full max-lg:flex-col-reverse">

        {/* Resume Preview */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">

          {imageUrl && resumeUrl && (

            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">

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
        <section className="feedback-section">

          <h2 className="text-4xl !text-black font-bold">
            Resume Review
          </h2>

          {feedback ? (

            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">

              {/* Summary */}
              <Summary feedback={feedback} />

              {/* ATS */}
              <ATS
                score={feedback?.ATS?.score || 0}
                suggestions={feedback?.ATS?.tips || []}
              />

              {/* Detailed Feedback */}
              <Details feedback={feedback} />

            </div>

          ) : (

            <img
              src="/images/resume-scan-2.gif"
              className="w-full"
              alt="loading"
            />

          )}

        </section>

      </div>

    </main>
  );
};

export default Resume;