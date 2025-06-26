// === Trivia Quiz App JS Logic ===

// DOM Elements
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
let toggleBtn = document.getElementById('toggle-dark');

// Variables
let currentQuestion = {};
let score = 0;
let questionIndex = 0;
let questions = [];

// Utility Functions

// Decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Quiz Logic

// Display a question
function showQuestion() {
  let q = questions[questionIndex];
  questionEl.textContent = decodeHTML(q.question);
  console.log("Question loaded:", q.question); // Debug

  const allAnswers = shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHTML));
  answersEl.innerHTML = '';

  allAnswers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(answer, decodeHTML(q.correct_answer));
    answersEl.appendChild(btn);
  });
}

// Check selected answer
function checkAnswer(selected, correct) {
  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add('correct');
    } else if (btn.textContent === selected) {
      btn.classList.add('incorrect');
    }
  });

  if (selected === correct) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
  }

  nextBtn.style.display = 'block';
}

// Handle next button click
nextBtn.onclick = () => {
  questionIndex++;
  if (questionIndex < questions.length) {
    showQuestion();
    nextBtn.style.display = 'none';
  } else {
    questionEl.textContent = `Quiz complete! Final Score: ${score}/${questions.length}`;
    answersEl.innerHTML = '';
    nextBtn.style.display = 'none';
  }
};

// Start the quiz
function startQuiz() {
  fetch('https://opentdb.com/api.php?amount=5&category=17&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      showQuestion();
    });
}

// Dark Mode

// Toggle theme
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme and start quiz
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  startQuiz();
});

// TODO: Add restart button feature
