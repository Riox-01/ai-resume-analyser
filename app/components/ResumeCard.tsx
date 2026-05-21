import { Link } from "react-router";
import ScoreCircle from "~/components/scorecircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: {
    id,
    companyName,
    jobTitle,
    feedback,
    imagePath,
  },
}: {
  resume: Resume;
}) => {

  const { fs } = usePuterStore();

  const [resumeUrl, setResumeUrl] =
    useState("");

  useEffect(() => {

    let objectUrl = "";

    const loadResume = async () => {

      const blob =
        await fs.read(imagePath);

      if (!blob) return;

      objectUrl =
        URL.createObjectURL(blob);

      setResumeUrl(objectUrl);
    };

    loadResume();

    return () => {

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

    };

  }, [imagePath]);

  return (

    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 w-full max-w-full overflow-hidden"
    >

      <div className="resume-card-header flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">

        <div className="flex flex-col gap-2 max-w-full">

          {companyName && (

            <h2 className="!text-black font-bold break-words text-xl sm:text-2xl">

              {companyName}

            </h2>

          )}

          {jobTitle && (

            <h3 className="text-base sm:text-lg break-words text-gray-500">

              {jobTitle}

            </h3>

          )}

          {!companyName && !jobTitle && (

            <h2 className="!text-black font-bold text-xl sm:text-2xl">

              Resume

            </h2>

          )}

        </div>

        <div className="flex-shrink-0 scale-75 sm:scale-90 md:scale-100 self-start">

          <ScoreCircle
            score={feedback?.overallScore || 0}
          />

        </div>

      </div>

      {resumeUrl && (

        <div className="gradient-border animate-in fade-in duration-1000 overflow-hidden rounded-2xl">

          <div className="w-full h-full">

            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[220px] sm:h-[280px] md:h-[350px] object-cover object-top"
            />

          </div>

        </div>

      )}

    </Link>
  );
};

export default ResumeCard;