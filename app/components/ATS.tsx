interface ATSProps {
  score: number;
  suggestions: {
    type?: string;
    tip?: string;
    explanation?: string;
  }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {

  const scoreLabel =
    score > 69
      ? "Great Job!"
      : score > 49
      ? "Good Start"
      : "Needs Improvement";

  return (
    <section className="w-full rounded-3xl border border-gray-200 bg-[#eefaf1] p-6">

      <div className="flex items-center gap-4">

        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#72d6c9] to-[#3fb6a8] shadow-md">
          <img
            src="/icons/check.svg"
            alt="ATS"
            className="size-7"
          />
        </div>

        <h2 className="text-5xl font-bold text-[#314158]">
          ATS Score - {score}/100
        </h2>

      </div>

      <div className="mt-8 flex flex-col gap-4">

        <div>
          <h3 className="text-3xl font-bold text-black">
            {scoreLabel}
          </h3>

          <p className="mt-4 text-xl text-[#314158] leading-relaxed">
            This score represents how well your resume is likely to
            perform in Applicant Tracking Systems used by employers.
          </p>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-4 mt-4">

          {suggestions?.map((item, index) => (

            <div
              key={index}
              className="flex flex-col gap-2 bg-white border border-yellow-200 rounded-2xl p-4"
            >

              <div className="flex items-center gap-3">

                <img
                  src="/icons/warning.svg"
                  alt="warning"
                  className="size-5"
                />

                <p className="text-lg font-semibold text-black">
                  {item?.tip || "Suggestion"}
                </p>

              </div>

              <p className="text-gray-600 leading-relaxed">
                {item?.explanation || ""}
              </p>

            </div>

          ))}

        </div>

        <p className="italic text-2xl text-[#314158] mt-4">
          Keep refining your resume to improve your chances of getting
          past ATS filters and into the hands of recruiters.
        </p>

      </div>

    </section>
  );
};

export default ATS;