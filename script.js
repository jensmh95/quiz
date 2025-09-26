const trivia_categories = [
  {
    id: 9,
    name: "General Knowledge",
  },
  {
    id: 10,
    name: "Books",
  },
  {
    id: 11,
    name: "Film",
  },
  {
    id: 12,
    name: "Music",
  },
  {
    id: 13,
    name: "Musicals & Theatres",
  },
  {
    id: 14,
    name: "Television",
  },
  {
    id: 15,
    name: "Video Games",
  },
  {
    id: 16,
    name: "Board Games",
  },
  {
    id: 17,
    name: "Science & Nature",
  },
  {
    id: 18,
    name: "Computers",
  },
  {
    id: 19,
    name: "Mathematics",
  },
  {
    id: 20,
    name: "Mythology",
  },
  {
    id: 21,
    name: "Sports",
  },
  {
    id: 22,
    name: "Geography",
  },
  {
    id: 23,
    name: "History",
  },
  {
    id: 24,
    name: "Politics",
  },
  {
    id: 25,
    name: "Art",
  },
  {
    id: 26,
    name: "Celebrities",
  },
  {
    id: 27,
    name: "Animals",
  },
  {
    id: 28,
    name: "Vehicles",
  },
  {
    id: 29,
    name: "Comics",
  },
  {
    id: 30,
    name: "Gadgets",
  },
  {
    id: 31,
    name: "Japanese Anime & Manga",
  },
  {
    id: 32,
    name: "Cartoon & Animations",
  },
];
const startBtn = document.querySelector(".start-btn");
const categories = document.querySelector(".categories");
const numberOfQuestionsInput = document.querySelector(".number-of-questions");
const quizContainer = document.querySelector(".quiz");
const submitAnswersBtn = document.querySelector(".submit");

function getCategories() {
  const category = trivia_categories.find(
    (obj) => obj.name === categories.value
  );
  return category ? category.id : null;
}

function getNumberOfQuestions() {
  return numberOfQuestionsInput.value;
}

startBtn.addEventListener("click", renderQuestions);

submitAnswersBtn.addEventListener("click", function () {
  const quizAnswers = document.getElementById("quiz-answers");
  console.log(quizAnswers);
});

async function generateQuestions() {
  const category = getCategories();
  const numberOfQuestions = getNumberOfQuestions();
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}`
  );
  const myJson = await response.json();
  const results = myJson.results;
  console.log(results);
  return results;
}

// <!--
// category: "General Knowledge"
// correct_answer: "Scimitar"
// difficulty: "easy"
// incorrect_answers: ['Falchion', 'Ulfberht', 'Flamberge']
// question: "Which one of these is not a typical European sword design?"
// type: "multiple"
// -->

async function renderQuestions() {
  const results = await generateQuestions();
  submitAnswersBtn.style.display = "block";
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
      const alternativeOne = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );
      const alternativeTwo = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );
      const alternativeThree = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );
      const alternativeFour = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );

      markup += `
            <div class="question-container">
            <h3>${results[i].question}</h3>
            </div>
            <div class="answers-container">
            <form id="quiz-answers">
            <input type="radio" name="q${
              i + 1
            }" value="${alternativeOne}" required>
                <label for="${alternativeOne}">${alternativeOne}</label><br>
                <input type="radio" name="q${i + 1}" value="${alternativeTwo}">
                <label for="${alternativeTwo}">${alternativeTwo}</label><br>
                <input type="radio" name="q${
                  i + 1
                }" value="${alternativeThree}">
                <label for="${alternativeThree}">${alternativeThree}</label><br>
                <input type="radio" name="q${i + 1}" value="${alternativeFour}">
                <label for="${alternativeFour}">${alternativeFour}</label><br><br>
                </form>
                </div>
                `;
    } else {
      const alternatives = [
        `${results[i].incorrect_answers[0]}`,
        `${results[i].correct_answer}`,
      ];
      const alternativeOne = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );
      const alternativeTwo = alternatives.splice(
        Math.floor(Math.random() * alternatives.length),
        1
      );

      markup += `
            <div class="question-container">
            <h3>${results[i].question}</h3>
      </div>
      <div class="answers-container">
      <form>
      <input type="radio" name="q${i + 1}" value="${alternativeOne}" required>
        <label for="${alternativeOne}">${alternativeOne}</label><br>
            <input type="radio" name="q${i + 1}" value="${alternativeTwo}">
                <label for="${alternativeTwo}">${alternativeTwo}</label><br>
                    </form>
                    </div>
                    `;
    }
  }
  quizContainer.insertAdjacentHTML("afterbegin", markup);
}

// function createOptions() {
//   let res = ``;
//   for (let obj of trivia_categories) {
//     console.log(obj);
//     res += `<option value="${obj.name}">${obj.name}</option>`;
//   }
//   return res;
// }
