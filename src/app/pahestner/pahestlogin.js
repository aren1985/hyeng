const checkAnswer = () => {
  const correctAnswer = sentences[currentSentenceIndex]?.englishsentence;
  const normalizedSpokenText = normalizeText(spokenText);
  const normalizedCorrectAnswer = normalizeText(correctAnswer);

  if (normalizedSpokenText === normalizedCorrectAnswer) {
    setIsCorrect(true);
    setModalImage(correctImage);
  } else {
    setIsCorrect(false);
    setModalImage(incorrectImage);
  }

  setShowModal(true);
};
