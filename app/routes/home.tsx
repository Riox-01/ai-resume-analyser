import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resuvault" },
    {
      name: "description",
      content: "Smart feedback for your dream job!",
    },
  ];
}

export default function Home() {

  const { auth, kv } = usePuterStore();

  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {

    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }

  }, [auth.isAuthenticated]);

  useEffect(() => {

    const loadResumes = async () => {

      setLoadingResumes(true);

      const resumes = (
        await kv.list("resume:*", true)
      ) as KVItem[];

      const parsedResumes = resumes?.map((resume) =>
        JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);

      setLoadingResumes(false);

    };

    loadResumes();

  }, []);

  return (

    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen overflow-x-hidden">

      <Navbar />

      <section className="main-section px-4 sm:px-6 md:px-10">

        <div className="page-heading py-10 sm:py-14 md:py-16">

          <h1 className="text-center leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl break-words">

            Track Your Applications & Resume Ratings

          </h1>

          {!loadingResumes && resumes?.length === 0 ? (

            <h2 className="text-center text-lg sm:text-xl md:text-2xl px-2 sm:px-6 mt-6 leading-relaxed">

              No resumes found. Upload your first resume to get feedback.

            </h2>

          ) : (

            <h2 className="text-center text-lg sm:text-xl md:text-2xl px-2 sm:px-6 mt-6 leading-relaxed">

              Review your submissions and check AI-powered feedback.

            </h2>

          )}

        </div>

        {loadingResumes && (

          <div className="flex flex-col items-center justify-center">

            <img
              src="/images/resume-scan-2.gif"
              className="w-[150px] sm:w-[200px]"
              alt="loading"
            />

          </div>

        )}

        {!loadingResumes && resumes.length > 0 && (

          <div className="resumes-section grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {resumes.map((resume) => (

              <ResumeCard
                key={resume.id}
                resume={resume}
              />

            ))}

          </div>

        )}

        {!loadingResumes && resumes?.length === 0 && (

          <div className="flex flex-col items-center justify-center mt-10 gap-4">

            <Link
              to="/upload"
              className="primary-button w-full sm:w-fit text-base sm:text-lg md:text-xl font-semibold px-6 py-4 text-center"
            >

              Upload Resume

            </Link>

          </div>

        )}

      </section>

    </main>
  );
}