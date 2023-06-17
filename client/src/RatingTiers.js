const SCORE_1_BEHAVIORS = ["Made threats", "Sexist", "Racist", "Other discriminatory comments"]
const SCORE_2_BEHAVIORS = ["Leaving the game", "Intentionally losing", "Rude", "Made inappropriate comments"]
const SCORE_3_BEHAVIORS = ["Average communication", "No communication"]
const SCORE_4_BEHAVIORS = ["Friendly communication", "Fun and lighthearted", "Maintained motivation when losing"]
const SCORE_5_BEHAVIORS = ["Encouraging", "Called out poor behaviour", "Helpful to new players"]

function generateScoreMap(tier) {
  let map = new Map();
  // iterate through tiers
  for (let i = 1; i <= tier.length; i++) {
    const feedbacks = tier.at(i-1);
    for (let j = 0; j < feedbacks.length; j++) {
      const act = feedbacks.at(j);
      map.set(act, i)     
    }   
  }
  return map;
}

const BEHAVIOR_SCORE_MAP = generateScoreMap([SCORE_1_BEHAVIORS, SCORE_2_BEHAVIORS, SCORE_3_BEHAVIORS, SCORE_4_BEHAVIORS, SCORE_5_BEHAVIORS]);

function getScores (choices) {
  let scores = [];
  for (let i = 0; i < choices.length; i++) {
    const choice = choices.at(i);
    const score = BEHAVIOR_SCORE_MAP.get(choice);
    console.log("final scores: " + score);
    scores.push(BEHAVIOR_SCORE_MAP.get(choice));
  }
  return scores;
}

function getFeedbacks (choices) {
  const feedbackString = choices.reduce((acc, curr) => acc + `, "` + curr + `"`, "");
  const ret = feedbackString.substring(1);
  return (ret);
}


module.exports = {SCORE_1_BEHAVIORS, SCORE_2_BEHAVIORS, SCORE_3_BEHAVIORS, SCORE_4_BEHAVIORS, SCORE_5_BEHAVIORS, getScores, getFeedbacks}