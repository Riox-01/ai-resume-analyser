import { cn } from "~/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({
  score,
}: {
  score: number;
}) => {

  return (

    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-1 rounded-[96px] w-fit",
        score > 69
          ? "bg-badge-green"
          : score > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >

      <img
        src={
          score > 69
            ? "/icons/check.svg"
            : "/icons/warning.svg"
        }
        alt="score"
        className="size-4"
      />

      <p
        className={cn(
          "text-xs sm:text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >

        {score}/100

      </p>

    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {

  return (

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center py-2 w-full">

      <p className="text-xl sm:text-2xl font-semibold break-words">

        {title}

      </p>

      <ScoreBadge
        score={categoryScore || 0}
      />

    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips?: {
    type?: "good" | "improve";
    tip?: string;
    explanation?: string;
  }[];
}) => {

  if (!tips || tips.length === 0) {

    return (

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-4 break-words">

        No feedback available yet.

      </div>

    );
  }

  // Remove duplicate tips

  const uniqueTips = tips.filter(
    (tip, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.tip
            ?.trim()
            .toLowerCase() ===
          tip.tip
            ?.trim()
            .toLowerCase()
      )
  );

  const summaryTips =
    uniqueTips.slice(0, 2);

  const detailedTips =
    uniqueTips.slice(2);

  return (

    <div className="flex flex-col gap-4 items-center w-full overflow-hidden">

      {/* Summary Tips */}

      <div className="bg-gray-50 w-full rounded-lg px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {summaryTips.map((tip, index) => (

          <div
            className="flex flex-row gap-2 items-start break-words"
            key={`summary-${index}`}
          >

            <img
              src={
                tip?.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              alt="score"
              className="size-5 shrink-0 mt-1"
            />

            <p className="text-base sm:text-lg md:text-xl text-gray-500 break-words">

              {tip?.tip ||
                "No tip provided"}

            </p>

          </div>

        ))}

      </div>

      {/* Detailed Tips */}

      <div className="flex flex-col gap-4 w-full">

        {detailedTips.map((tip, index) => (

          <div
            key={`detail-${index}`}
            className={cn(
              "flex flex-col gap-3 rounded-2xl p-4 sm:p-5 overflow-hidden",
              tip?.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >

            <div className="flex flex-row gap-2 items-start break-words">

              <img
                src={
                  tip?.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt="score"
                className="size-5 shrink-0 mt-1"
              />

              <p className="text-lg sm:text-xl font-semibold break-words">

                {tip?.tip ||
                  "No title"}

              </p>

            </div>

            <p className="text-sm sm:text-base leading-relaxed break-words">

              {tip?.explanation ||
                "No explanation available"}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

const Details = ({
  feedback,
}: {
  feedback: Feedback;
}) => {

  return (

    <div className="flex flex-col gap-4 w-full overflow-hidden">

      <Accordion>

        <AccordionItem id="tone-style">

          <AccordionHeader itemId="tone-style">

            <CategoryHeader
              title="Tone & Style"
              categoryScore={
                feedback?.toneAndStyle
                  ?.score || 0
              }
            />

          </AccordionHeader>

          <AccordionContent itemId="tone-style">

            <CategoryContent
              tips={
                feedback?.toneAndStyle
                  ?.tips || []
              }
            />

          </AccordionContent>

        </AccordionItem>

        <AccordionItem id="content">

          <AccordionHeader itemId="content">

            <CategoryHeader
              title="Content"
              categoryScore={
                feedback?.content
                  ?.score || 0
              }
            />

          </AccordionHeader>

          <AccordionContent itemId="content">

            <CategoryContent
              tips={
                feedback?.content
                  ?.tips || []
              }
            />

          </AccordionContent>

        </AccordionItem>

        <AccordionItem id="structure">

          <AccordionHeader itemId="structure">

            <CategoryHeader
              title="Structure"
              categoryScore={
                feedback?.structure
                  ?.score || 0
              }
            />

          </AccordionHeader>

          <AccordionContent itemId="structure">

            <CategoryContent
              tips={
                feedback?.structure
                  ?.tips || []
              }
            />

          </AccordionContent>

        </AccordionItem>

        <AccordionItem id="skills">

          <AccordionHeader itemId="skills">

            <CategoryHeader
              title="Skills"
              categoryScore={
                feedback?.skills
                  ?.score || 0
              }
            />

          </AccordionHeader>

          <AccordionContent itemId="skills">

            <CategoryContent
              tips={
                feedback?.skills
                  ?.tips || []
              }
            />

          </AccordionContent>

        </AccordionItem>

      </Accordion>

    </div>
  );
};

export default Details;