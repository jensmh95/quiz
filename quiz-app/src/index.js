import express from "express";
import fs from "fs";
import cors from "cors";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  HeadingLevel,
} from "docx";
import he from "he";
const app = express();
app.use(cors());
app.use(express.json());

app.post("/write-file", (req, res) => {
  const { fileName, content } = req.body;
  console.log("CONTENT");
  console.log(content);

  if (!fileName || !content) {
    return res.status(400).send("Missing filename or content");
  }

  const quizQuestions = [];
  const quizAnswers = [];

  for (let i = 0; i < content.length; i++) {
    quizQuestions.push(
      new Paragraph({}),
      new Paragraph({
        children: [
          new TextRun({
            text: `Q${i + 1}: ${he.decode(content[i].question)}`,
            bold: true,
          }),
        ],
      }),
      new Paragraph({}),
    );
    const answers = [
      ...content[i].incorrect_answers,
      content[i].correct_answer,
    ];

    const shuffled = shuffle(answers);
    shuffled.forEach((element, index) => {
      quizQuestions.push(
        new Paragraph({
          children: [new TextRun(`${index + 1}: ${he.decode(element)}`)],
        }),
      );
    });
    quizAnswers.push(
      new Paragraph({}),
      new Paragraph({
        children: [
          new TextRun(`${i + 1}: ${he.decode(content[i].correct_answer)}`),
        ],
      }),
    );
  }

  // Write to word doc
  const quiz = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Here is your quiz!",
            heading: HeadingLevel.HEADING_1,
          }),
          ...quizQuestions,
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            text: "Here are the correct answers!",
            heading: HeadingLevel.HEADING_1,
          }),
          ...quizAnswers,
        ],
      },
    ],
  });

  Packer.toBuffer(quiz).then((buffer) => {
    fs.writeFileSync(fileName, buffer);
  });
  res.send("File written successfully");
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
