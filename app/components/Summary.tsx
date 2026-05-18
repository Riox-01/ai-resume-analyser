import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

interface SummaryProps {
  feedback: Feedback;
}

const Summary = ({ feedback }: SummaryProps) => {

  const overallScore = Math.round(
    (
      (feedback?.ATS?.score || 0) +
      (feedback?.toneAndStyle?.score || 0) +
      (feedback?.content?.score || 0) +
      (feedback?.structure?.score || 0) +
      (feedback?.skills?.score || 0)
    ) / 5
  );

  return (
    <section className="w-full border border-gray-200 rounded-2xl p-6 bg-white">

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Score Gauge */}
        <div className="flex items-center justify-center">
          <ScoreGauge score={overallScore} />
        </div>

        {/* Summary Content */}
        <div className="flex flex-col gap-6 flex-1">

          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Your Resume Score
            </h2>

            <p className="text-lg text-gray-500 mt-2">
              This score is calculated based on the variables listed below.
            </p>
          </div>

          {/* Score Cards */}
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-5">

              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium text-black">
                  Tone & Style
                </p>

                <ScoreBadge
                  score={feedback?.toneAndStyle?.score || 0}
                />
              </div>

              <p className="text-3xl font-semibold text-black">
                {feedback?.toneAndStyle?.score || 0}/100
              </p>

            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-5">

              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium text-black">
                  Content
                </p>

                <ScoreBadge
                  score={feedback?.content?.score || 0}
                />
              </div>

              <p className="text-3xl font-semibold text-black">
                {feedback?.content?.score || 0}/100
              </p>

            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-5">

              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium text-black">
                  Structure
                </p>

                <ScoreBadge
                  score={feedback?.structure?.score || 0}
                />
              </div>

              <p className="text-3xl font-semibold text-black">
                {feedback?.structure?.score || 0}/100
              </p>

            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-5">

              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium text-black">
                  Skills
                </p>

                <ScoreBadge
                  score={feedback?.skills?.score || 0}
                />
              </div>

              <p className="text-3xl font-semibold text-black">
                {feedback?.skills?.score || 0}/100
              </p>

            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-5">

              <div className="flex items-center gap-4">
                <p className="text-2xl font-medium text-black">
                  ATS
                </p>

                <ScoreBadge
                  score={feedback?.ATS?.score || 0}
                />
              </div>

              <p className="text-3xl font-semibold text-black">
                {feedback?.ATS?.score || 0}/100
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Summary;