import { trivia_categories, decodeHtml } from "./utilities.js";

const startBtn = document.querySelector(".btn");
const categories = document.querySelector(".categories");
const numberOfQuestionsInput = document.querySelector(".number-of-questions");
const submitAnswersBtn = document.querySelector(".submit");
const formElement = document.querySelector(".form");
const mainContent = document.querySelector(".main");
const loadingText = document.querySelector(".loading");
const downloadQuizLiItem = document.querySelector(".download-quiz");

const headerContainer = document.querySelector(".header-container");
const categoriesContainer = document.querySelector(".categories-container");
const inputContainer = document.querySelector(".input-container");

const correct_answers = [];
const answerArr = [];

function getCategories() {
  const category = trivia_categories.find(
    (obj) => obj.name === categories.value,
  );
  return category ? category.id : null;
}

function getNumberOfQuestions() {
  return numberOfQuestionsInput.value;
}

async function downloadQuiz(fileName, content) {
  try {
    const response = await fetch("http://localhost:3001/write-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: fileName,
        content: content,
      }),
    });
    if (!response.ok) {
      throw new Error("Could not reach backend");
    }
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error("Error downloading quiz: ", error);
  }
}

async function generateQuestions() {
  try {
    const category = getCategories();
    const numberOfQuestions = getNumberOfQuestions();
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    const results = data.results;
    await downloadQuiz("quiz.docx", results);

    for (let i = 0; i < results.length; i++) {
      const answer = {
        questionId: i + 1,
        givenAnswer: "",
        correctAnswer: decodeHtml(results[i].correct_answer),
      };
      answerArr.push(answer);
    }
    console.log(answerArr);
    return results;
  } catch (error) {
    console.error("Error generating questions: ", error);
    return null;
  }
}

startBtn.addEventListener("click", renderQuestions);

submitAnswersBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let score = 0;
  const formData = new FormData(formElement);
  const answers = Object.fromEntries(formData.entries());
  for (let i = 0; i < correct_answers.length; i++) {
    const labelCorrect = document.querySelector(
      `label[for="${correct_answers[i]}-${i}"]`,
    );
    labelCorrect.classList.add("correct");
    if (answers[`q${i + 1}`] === correct_answers[i]) {
      score += 1;
    } else {
      const labelWrong = document.querySelector(
        `label[for="${answers[`q${i + 1}`]}-${i}"]`,
      );
      labelWrong.classList.add("wrong");
    }
  }
  renderScore(score, correct_answers.length);
  submitAnswersBtn.disabled = true;
});

function renderScore(score, numberOfQuestions) {
  const html = `
  <div class="score-container">
    <h4>Score: ${score}/${numberOfQuestions}</h4>
  </div>`;
  formElement.insertAdjacentHTML("beforeend", html);
}

async function renderQuestions() {
  headerContainer.classList.add("hidden");
  categoriesContainer.classList.add("hidden");
  inputContainer.classList.add("hidden");
  mainContent.classList.add("hidden");
  loadingText.classList.toggle("hidden");
  downloadQuizLiItem.classList.toggle("hidden");
  const results = await generateQuestions();

  let markup = ``;
  for (let i = 0; i < results.length; i++) {
    const questionType = results[i].type;
    if (questionType === "multiple") {
      const alternatives = [
        `${results[i].incorrect_answers[0]}`,
        `${results[i].incorrect_answers[1]}`,
        `${results[i].incorrect_answers[2]}`,
        `${results[i].correct_answer}`,
      ];
      correct_answers.push(decodeHtml(alternatives[3]));
      const alternativeOne = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );
      const alternativeTwo = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );
      const alternativeThree = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );
      const alternativeFour = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );

      markup += `
        <legend class="question-container">
          <h3>${results[i].question}</h3>
        </legend>

        <div class="option-item">
        <input type="radio" id="${alternativeOne}-${i}" name="q${
          i + 1
        }" value="${alternativeOne}">
        <label  for="${alternativeOne}-${i}">
          <span class="custom-radio"></span>  
          ${alternativeOne}</label>
        </div>

        <div class="option-item">
          <input type="radio" id="${alternativeTwo}-${i}" name="q${
            i + 1
          }" value="${alternativeTwo}">
          <label for="${alternativeTwo}-${i}">
            <span class="custom-radio"></span>
            ${alternativeTwo}
            </label>
        </div>

         <div class="option-item">
          <input type="radio" id="${alternativeThree}-${i}" name="q${
            i + 1
          }" value="${alternativeThree}">
          <label for="${alternativeThree}-${i}">
          <span class="custom-radio"></span>
          ${alternativeThree}
          </label>
        </div>
        
        <div class="option-item">
          <input type="radio" id="${alternativeFour}-${i}" name="q${
            i + 1
          }" value="${alternativeFour}">
            <label for="${alternativeFour}-${i}">
            <span class="custom-radio"></span>
            ${alternativeFour}
          </label>
        </div>
                `;
    } else {
      const alternatives = [
        `${results[i].incorrect_answers[0]}`,
        `${results[i].correct_answer}`,
      ];
      correct_answers.push(alternatives[1]);
      const alternativeOne = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );
      const alternativeTwo = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1,
      );

      markup += `
            <legend class="question-container">
            <h3>${results[i].question}</h3>
      </legend>

      <div class="option-item">
        <input type="radio" id="${alternativeOne}-${i}" name="q${
          i + 1
        }" value="${alternativeOne}" required>
          <label class="option" for="${alternativeOne}-${i}">
          <span class="custom-radio"></span>  
          ${alternativeOne}</label>
      </div>
      
      <div class="option-item">
        <input type="radio" id="${alternativeTwo}-${i}" name="q${
          i + 1
        }" value="${alternativeTwo}">
            <label class="option" for="${alternativeTwo}-${i}">
            <span class="custom-radio"></span>
          ${alternativeTwo}</label>
      </div>
                    `;
    }
  }
  submitAnswersBtn.classList.toggle("hidden");
  formElement.insertAdjacentHTML("afterbegin", markup);
  formElement.classList.toggle("hidden");
  loadingText.classList.toggle("hidden");
}
