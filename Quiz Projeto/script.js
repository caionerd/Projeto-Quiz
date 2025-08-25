// -------------------- Dados --------------------
const quizData = [
  {question: "Quem é conhecido como Rei do Pop?", options: ["Elvis Presley","Michael Jackson","Prince","Freddie Mercury"], answer: 1},
  {question: "Qual banda lançou o álbum 'Abbey Road'?", options: ["The Beatles","Queen","Pink Floyd","The Rolling Stones"], answer: 0},
  {question: "Qual gênero musical é originário da Jamaica?", options: ["Reggae","Samba","Rock","Jazz"], answer: 0},
  {question: "Quem é a Rainha do Soul?", options: ["Aretha Franklin","Whitney Houston","Madonna","Beyoncé"], answer: 0},
  {question: "Qual cantor é famoso pelo álbum 'Thriller'?", options: ["Elton John","Michael Jackson","David Bowie","Prince"], answer: 1},
  {question: "Qual instrumento é usado no flamenco?", options: ["Violão","Saxofone","Bateria","Piano"], answer: 0},
  {question: "Qual rapper lançou 'The Marshall Mathers LP'?", options: ["Eminem","Jay-Z","Tupac","Drake"], answer: 0},
  {question: "Qual cidade é conhecida por nascer o jazz?", options: ["Nova Orleans","Chicago","Nova York","Los Angeles"], answer: 0},
  {question: "Quem canta 'Rolling in the Deep'?", options: ["Adele","Lady Gaga","Katy Perry","Rihanna"], answer: 0},
  {question: "Qual banda lançou 'Bohemian Rhapsody'?", options: ["Queen","The Beatles","Led Zeppelin","Pink Floyd"], answer: 0}
];

const bizarreQuestions = [
  {question:"Olhe ao seu redor", options:["ok","estou com medo"]},
  {question:"Você está familiarizado com seu arredor?", options:["Sim","Não"]},
  {question:"Você sabe onde você está?", options:["Sim","Não"]},
  {question:"Você costuma questionar sua própria existência?", options:["Sim","Não"]},
  {question:"Você está respondendo por pura liberdade?", options:["Sim","Não"]},
  {question:"Você tem certeza?", options:["Sim","Não"]},
  {question:"Você se sente seguro/a onde você está?", options:["Sim","Não"]},
  {question:"Se as luzes se apagarem você ficaria com medo?", options:["Sim","Não"]},
  {question:"Você já se perguntou quando irá morrer?", options:["Sim","Não"]},
  {question:"Se você de repente sumisse alguém lhe procuraria?", options:["Sim","Não"]},
  {question:"Você está sozinho/a?", options:["Sim","Não"]},
  {question:"Se você gritar alguém lhe ouviria?", options:["Sim","Não"]},
  {question:"Você conhece a pessoa que está atrás de você?", options:["Sim","Não"]},
  {question:"Seus sentimentos são reais?", options:["Sim","Não"]},
  {question:"Existe algum sentido da vida?", options:["Sim","Não"]},
  {question:"Você sabe o que está acontecendo?", options:["Sim","Não"]},
  {question:"Se te fosse contado a verdade sobre sua existência você acreditaria?", options:["Sim","Não"]},
  {question:"Quando eu lhe faço perguntas é realmente você que está respondendo?", options:["Sim","Não"]},
  {question:"Você está bem?", options:["Sim","Não"]}
];

// -------------------- Estado --------------------
let currentQuestion = 0;
let score = 0;
let inBizarre = false;

// -------------------- Elementos --------------------
let questionEl = document.getElementById('question');
let answersEl = document.getElementById('answers');
let submitBtn = document.getElementById('submit');
const progressBar = document.getElementById('progressBar');
const darkToggle = document.getElementById('darkModeToggle');
const contrastToggle = document.getElementById('highContrastToggle');
const configToggle = document.querySelector('.config-toggle');
const configOptions = document.querySelector('.config-options');
const card = document.getElementById('card');

// -------------------- Sons --------------------
let noise = new Audio('ambience sound.wav');
noise.loop = true;
noise.volume = 0.1;

// 🔊 Som perturbador do modo bizarro
let bizarreSound = new Audio('ambience sound.wav'); // coloque seu arquivo na pasta do projeto
bizarreSound.loop = true;
bizarreSound.volume = 0.4;

// -------------------- Tema inicial --------------------
document.body.classList.add('dark');
darkToggle.checked = true;

// -------------------- Configurações --------------------
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});
contrastToggle.addEventListener('change', () => {
  document.body.classList.toggle('high-contrast', contrastToggle.checked);
});
configToggle.addEventListener('click', () => {
  configOptions.classList.toggle('show');
});

// -------------------- Funções --------------------

// Carregar pergunta
function loadQuestion() {
  const currentQuiz = inBizarre ? bizarreQuestions[currentQuestion] : quizData[currentQuestion];
  questionEl.innerText = currentQuiz.question;
  answersEl.innerHTML = '';
  currentQuiz.options.forEach((option, idx) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="answer" value="${idx}"> ${option}`;
    answersEl.appendChild(label);
  });
  if(!inBizarre) {
    progressBar.style.width = (currentQuestion / quizData.length * 100) + '%';
  } else {
    progressBar.style.width = "0%";
  }
}

// Mostrar tela final
function showFinalScreen() {
  card.innerHTML = `
    <h2>Fim do Quiz</h2>
    <p>Você acertou <strong>${score}</strong> de ${quizData.length} perguntas normais.</p>
    <button id="restartBtn">Reiniciar</button>
  `;

  // parar sons
  noise.pause();
  noise.currentTime = 0;
  bizarreSound.pause();
  bizarreSound.currentTime = 0;

  document.body.classList.remove('bizarre');
  document.getElementById('restartBtn').addEventListener('click', restartQuiz);
}

// Reiniciar quiz
function restartQuiz() {
  score = 0;
  currentQuestion = 0;
  inBizarre = false;

  card.innerHTML = `
    <h2 id="question"></h2>
    <div class="answers" id="answers"></div>
    <button id="submit">Próxima</button>
  `;

  // Reatribui elementos
  questionEl = document.getElementById('question');
  answersEl = document.getElementById('answers');
  submitBtn = document.getElementById('submit');

  submitBtn.addEventListener('click', handleNext);

  loadQuestion();
}

// Lógica do próximo
function handleNext() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if(!selected && currentQuestion < (inBizarre ? bizarreQuestions.length : quizData.length)) {
    return alert("Selecione uma opção!");
  }

  // Contar pontos
  if(!inBizarre && selected && parseInt(selected.value) === quizData[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;

  // Se terminou quiz normal → entra no bizarro
  if(!inBizarre && currentQuestion >= quizData.length) {
    inBizarre = true;
    currentQuestion = 0;
    document.body.classList.add('bizarre');
    noise.play();
    bizarreSound.play(); //
    loadQuestion();
    return;
  }

  // Se terminou quiz bizarro → fim
  if(inBizarre && currentQuestion >= bizarreQuestions.length) {
    showFinalScreen();
    return;
  }

  loadQuestion();
}

// -------------------- Inicialização --------------------
submitBtn.addEventListener('click', handleNext);
loadQuestion();
