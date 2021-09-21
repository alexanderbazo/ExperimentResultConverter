import * as fs from "fs";

const CSV_HEADERS = ["EXPERIMENT_ID",
    "EXPERIMENT_STATE", 
    "STARTED_AT", 
    "QUESTIONNAIRE_STARTED_AT",
    "FIRST_CONDITION_STARTED_AT",
    "FIRST_QUIZ_STARTED_AT",
    "FIRST_QUIZ_COMPLETED_AT",
    "SECOND_CONDITION_STARTED_AT",
    "SECOND_QUIZ_STARTED_AT",
    "SECOND_QUIZ_COMPLETED_AT",
    "PARTICIPIANT_ID",
    "PARTICIPIANT_AGE",
    "PARTICIPIANT_GENDER",
    "PARTICIPIANT_SUBJECT",
    "PARTICIPIANT_SEMESTER",
    "PARTICIPIANT_FINISHED_OOP",
    "PARTICIPIANT_FINISHED_ANDROID",
    "PARTICIPIANT_FINISHED_ADP",
    "PARTICIPIANT_FINISHED_DB",
    "PARTICIPIANT_SELF_ASSESSMENT_BUBBLE_SORT",
    "PARTICIPIANT_SELF_ASSESSMENT_SELECTION_SORT",
    "PARTICIPIANT_SELF_ASSESSMENT_INSERTION_SORT",
    "PARTICIPIANT_SELF_ASSESSMENT_CAN_DESCRIBE",
    "PARTICIPIANT_SELF_ASSESSMENT_CAN_NAME",
    "PARTICIPIANT_SELF_ASSESSMENT_CAN_DISTINGUISH",
    "FIST_CONDITON",
    "FIRST_ALGORITHM",
    "SECOND_CONDITION",
    "SECOND_ALGORITHM",
    "FIRST_QUIZ_QUESTION_ONE",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_THREE",
    "FIRST_QUIZ_QUESTION_TWO_NOT_ANSWERED",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_THREE",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_FOUR",
    "FIRST_QUIZ_QUESTION_THREE_NOT_ANSWERED",
    "FIRST_QUIZ_QUESTION_FOUR_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_FOUR_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_FOUR_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_ONE",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_THREE",
    "SECOND_QUIZ_QUESTION_TWO_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_THREE",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_FOUR",
    "SECOND_QUIZ_QUESTION_THREE_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_FOUR_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_FOUR_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_FOUR_NOT_ANSWERED"
];

class Result {

    constructor(data) {
        // Experiment meta data
        this.experimentID = data.id;
        this.state = data.state;
        // Timestamps
        // TODO: Add or calculate delta values
        this.experimentStartedAt = data.results.log[0].value;
        this.questionnaireStarted = data.results.log[1].value;
        this.firstConditionStarted = data.results.log[2].value;
        this.firstQuizStarted = data.results.log[3].value;
        this.firstQuizCompleted = data.results.log[4].value;
        this.secondConditionStarted = data.results.log[5].value;
        this.secondQuizStarted = data.results.log[6].value;
        this.secondQuizCompleted = data.results.log[7].value;
        // Participiant information
        this.participantID = data.currentParticipant;
        this.participantAge = data.results.questionnaire.age;
        this.participantGender = data.results.questionnaire.gender;
        this.participiantSubject = data.results.questionnaire.studies;
        this.participiantSemester = data.results.questionnaire.semester;
        this.participantFinishedOOP = data.results.questionnaire.studyprogress.includes("answer1") ? "yes" : "no";
        this.participantFinishedAndroid = data.results.questionnaire.studyprogress.includes("answer2") ? "yes" : "no";
        this.participantFinishedADP = data.results.questionnaire.studyprogress.includes("answer3") ? "yes" : "no";
        this.participantFinishedDB = data.results.questionnaire.studyprogress.includes("answer4") ? "yes" : "no";
        this.participantSelfAssessmentBubbleSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem BubbleSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentSelectionSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem SelectionSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentInsertionSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem InsertionSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentCanDescribe = data.results.questionnaire["self-assessment"]["Ich kann den Ablauf verschiedener Sortieralgorithmen mit Worten beschreiben."];
        this.participantSelfAssessmentCanName = data.results.questionnaire["self-assessment"]["Wenn mir die Funktionsweise eines Sortieralgorithmus beschrieben wird kann ich diesen beim Namen nennen."];
        this.participantSelfAssessmentCanDistinguish = data.results.questionnaire["self-assessment"]["Ich kann Sortieralgorithmen anhand ihrer Beschreibung namentlich unterscheiden."];
        // Experiment condtions (mode and aglorithm)
        this.firstCondition = data.conditions[0].mode;
        this.firstAlgorithm = data.conditions[0].algorithm;
        this.secondCondition = data.conditions[1].mode;
        this.secondAlgorithm = data.conditions[1].algorithm;
        // Quiz results
        // The following work, assuming that the first entry of data.results.quizzes correspond to the first entry of data.conditions
        // TODO: Replace this with auto grading (as far as possible)
        // Saving answers for FIRST QUESTION in FIRST QUIZ (text)
        this.firstQuizQuestionOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question1;
        // Saving answers for SECOND QUESTION in FIRST QUIZ (multiple choice)
        this.firstQuizQuestionTwoAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer1") ? "selected" : "not selected";
        this.firstQuizQuestionTwoAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer2") ? "selected" : "not selected";
        this.firstQuizQuestionTwoAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer3") ? "selected" : "not selected";
        this.firstQuizQuestionTwoNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("noanswer") ? "selected" : "not selected";
        // Saving answers for THIRD QUESTION in FIRST QUIZ (multiple choice)
        this.firstQuizQuestionThreeAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer1") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer2") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer3") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerFour = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer4") ? "selected" : "not selected";
        this.firstQuizQuestionThreeNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("noanswer") ? "selected" : "not selected";
        // Saving answers for FOURTH QUESTION in FIRST QUIZ (single choice)
        // TODO: Check if naming conventions for answers are assumed correctly
        this.firstQuizQuestionFourAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "item1" ? "selected" : "not selected";
        this.firstQuizQuestionFourAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "item2" ? "selected" : "not selected";
        this.firstQuizQuestionFourNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "noanswer" ? "selected" : "not selected";
        // Saving answers for FIRST QUESTION in SECOND QUIZ (text)
        this.secondQuizQuestionOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question1;
        // Saving answers for SECOND QUESTION in SECOND QUIZ (multiple choice)
        this.secondQuizQuestionTwoAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer1") ? "selected" : "not selected";
        this.secondQuizQuestionTwoAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer2") ? "selected" : "not selected";
        this.secondQuizQuestionTwoAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer3") ? "selected" : "not selected";
        this.secondQuizQuestionTwoNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("noanswer") ? "selected" : "not selected";
        // Saving answers for THIRD QUESTION in SECOND QUIZ (multiple choice)
        this.secondQuizQuestionThreeAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer1") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer2") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer3") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerFour = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer4") ? "selected" : "not selected";
        this.secondQuizQuestionThreeNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("noanswer") ? "selected" : "not selected";
        // Saving answers for FOURTH QUESTION in SECOND QUIZ (single choice)
        // TODO: Check if naming conventions for answers are assumed correctly
        this.secondQuizQuestionFourAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "item1" ? "selected" : "not selected";
        this.secondQuizQuestionFourAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "item2" ? "selected" : "not selected";
        this.secondQuizQuestionFourNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "noanswer" ? "selected" : "not selected";
    }

    toCSVLine() {
        let parts = [];
        Object.getOwnPropertyNames(this).forEach(property => {
            let value = this[property],
                token;
            if (typeof value === "string") {
                token = value.replace(/"/g, '""');
            }
            if (typeof value === "number") {
                token = (value).toString();
            }
            if (typeof value === "boolean") {
                token = new Boolean(value).toString();
            }
            token = token.replace(/(?:\r\n|\r|\n)/g, " ");
            parts.push(`"${token}"`);
        });
        return parts.join(",")
    }

    static getCSVHeader() {
        return CSV_HEADERS.map( header => `"${header}"`).join(",");
    }

    static fromFilePath(path) {
        let content = fs.readFileSync(path, {
                encoding: "utf8",
            }),
            data = JSON.parse(content);
        return new Result(data);
    }
}

export default Result;