/**
 * retrieve all scores from DB
 */
exports.readScores = async () => {
  return fetch("/scores", { method: "GET" })
    .then((response) => response.json())
    .then((data) => data.map((score) => score.score))
    .catch((error) => {
      console.error(error);
    });
};

/**
 * submit new score to server
 * @param {number} score - the score to add to DB.
 */
exports.createScore = async (score) => {
  return fetch("/scores", {
    method: "POST",
    body: JSON.stringify({ score }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }).catch((error) => {
    console.error(error);
  });
};
