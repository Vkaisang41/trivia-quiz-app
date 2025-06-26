const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');

let currentQuestion = {};
let score = 0;
let questionIndex = 0;
let questions = [];

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  let q = questions[questionIndex];
  questionEl.textContent = decodeHTML(q.question);

  const allAnswers = shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHTML));
  answersEl.innerHTML = '';

  allAnswers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(answer, decodeHTML(q.correct_answer));
    answersEl.appendChild(btn);
  });
}

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

function startQuiz() {
  fetch('https://opentdb.com/api.php?amount=5&category=17&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      showQuestion();
    });
}

const toggleBtn = document.getElementById('toggle-dark');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  startQuiz();
});
