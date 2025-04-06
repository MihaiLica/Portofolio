const setup = document.getElementById("setup");
const startBtn = document.getElementById("start-btn");
const quiz = document.getElementById("quiz");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");

let questions = [];
let currentQuestion = 0;
let score = 0;

// Start the quiz
startBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;

  let url = `https://opentdb.com/api.php?amount=5&type=multiple`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results.map((q) => {
        const answers = [...q.incorrect_answers];
        const correctIndex = Math.floor(Math.random() * 4);
        answers.splice(correctIndex, 0, q.correct_answer);
        return {
          question: decodeHTML(q.question),
          answers: answers.map(decodeHTML),
          correct: correctIndex,
        };
      });

      setup.classList.add("hide");
      quiz.classList.remove("hide");
      loadQuestion();
    });
});

// Load the current question
function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(index);
    li.appendChild(btn);
    answersEl.appendChild(li);
  });
}

// Handle answer selection
function selectAnswer(selectedIndex) {
  const correct = questions[currentQuestion].correct;
  if (selectedIndex === correct) score++;
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show results after the quiz ends
function showResults() {
  quiz.classList.add("hide");
  resultEl.classList.remove("hide");
  scoreEl.textContent = `You scored ${score} out of ${questions.length}!`;
}

// Restart the quiz
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  resultEl.classList.add("hide");
  setup.classList.remove("hide");
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

