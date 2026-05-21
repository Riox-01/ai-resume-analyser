import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

interface SummaryProps {
  feedback: Feedback;
}

const Summary = ({
  feedback,
}: SummaryProps) => {

  const overallScore = Math.round(
    (
      (feedback?.ATS?.score || 0) +
      (feedback?.toneAndStyle?.score || 0) +
      (feedback?.content?.score || 0) +
      (feedback?.structure?.score || 0) +
      (feedback?.skills?.score || 0)
    ) / 5
  );

  const scoreItems = [
    {
      title: "Tone & Style",
      score:
        feedback?.toneAndStyle?.score || 0,
    },
    {
      title: "Content",
      score:
        feedback?.content?.score || 0,
    },
    {
      title: "Structure",
      score:
        feedback?.structure?.score || 0,
    },
    {
      title: "Skills",
      score:
        feedback?.skills?.score || 0,
    },
    {
      title: "ATS",
      score:
        feedback?.ATS?.score || 0,
    },
  ];

  return (

    <section className="w-full border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white overflow-hidden">

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">

        {/* Score Gauge */}

        <div className="flex items-center justify-center w-full lg:w-auto">

          <div className="scale-75 sm:scale-90 md:scale-100">

            <ScoreGauge
              score={overallScore}
            />

          </div>

        </div>

        {/* Summary Content */}

        <div className="flex flex-col gap-6 flex-1 w-full">

          <div className="text-center lg:text-left">

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words">

              Your Resume Score

            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-2 leading-relaxed">

              This score is calculated based
              on the variables listed below.

            </p>

          </div>

          {/* Score Cards */}

          <div className="flex flex-col gap-4 w-full">

            {scoreItems.map((item) => (

              <div
                key={item.title}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
              >

                <div className="flex flex-wrap items-center gap-3">

                  <p className="text-lg sm:text-xl md:text-2xl font-medium text-black break-words">

                    {item.title}

                  </p>

                  <ScoreBadge
                    score={item.score}
                  />

                </div>

                <p className="text-2xl sm:text-3xl font-semibold text-black break-words">

                  {item.score}/100

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default Summary;