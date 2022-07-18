import { trpc } from "../../../utils/trpc";

export const AllScoresChart = () => {
  const allScores = trpc.useQuery(["game.allScores"]);

  return (
    <div>
      All Scores
      <h3>All scores</h3>
      <ul>
        {allScores.data?.map((score) => (
          <li key={score.id}>{score.value}</li>
        ))}
      </ul>
    </div>
  );
};
