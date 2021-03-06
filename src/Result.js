import * as fs from "fs";
import ProofSheet from "./ProofSheet.js";

const CSV_HEADERS = [
    "SAMPLE_NUMBER",
    "EXPERIMENT_ID",
    "EXPERIMENT_STATE", 
    "STARTED_AT", 
    "QUESTIONNAIRE_STARTED_AT",
    "FIRST_CONDITION_STARTED_AT",
    "FIRST_QUIZ_STARTED_AT",
    "FIRST_QUIZ_COMPLETED_AT",
    "SECOND_CONDITION_STARTED_AT",
    "SECOND_QUIZ_STARTED_AT",
    "SECOND_QUIZ_COMPLETED_AT",
    "QUESTIONNAIRE_COMPLETION_TIME",
    "FIRST_CONDITION_COMPLETION_TIME",
    "FIRST_QUIZ_COMPLETION_TIME",
    "SECOND_CONDITION_COMPLETION_TIME",
    "SECOND_QUIZ_COMPLETION_TIME",
    "TIME_BETWEEN_FIRST_AND_SECOND_CONDITION",
    "TOTAL_EXPERIMENT_COMPLETION_TIME",
    "PARTICIPANT_ID",
    "PARTICIPANT_AGE",
    "PARTICIPANT_GENDER",
    "PARTICIPANT_SUBJECT",
    "PARTICIPANT_SEMESTER",
    "PARTICIPANT_FINISHED_OOP",
    "PARTICIPANT_FINISHED_ANDROID",
    "PARTICIPANT_FINISHED_ADP",
    "PARTICIPANT_FINISHED_DB",
    "PARTICIPANT_SELF_ASSESSMENT_BUBBLE_SORT",
    "PARTICIPANT_SELF_ASSESSMENT_SELECTION_SORT",
    "PARTICIPANT_SELF_ASSESSMENT_INSERTION_SORT",
    "PARTICIPANT_SELF_ASSESSMENT_CAN_DESCRIBE",
    "PARTICIPANT_SELF_ASSESSMENT_CAN_NAME",
    "PARTICIPANT_SELF_ASSESSMENT_CAN_DISTINGUISH",
    "PARTICIPANT_SELF_ASSESSMENT_SCORE",
    "FIRST_CONDITON",
    "FIRST_ALGORITHM",
    "SECOND_CONDITION",
    "SECOND_ALGORITHM",
    "FIRST_QUIZ_QUESTION_ONE",
    "FIRST_QUIZ_QUESTION_ONE_SCORE",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_TWO_ANSWER_THREE",
    "FIRST_QUIZ_QUESTION_TWO_NOT_ANSWERED",
    "FIRST_QUIZ_QUESTION_TWO_SCORE",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_THREE",
    "FIRST_QUIZ_QUESTION_THREE_ANSWER_FOUR",
    "FIRST_QUIZ_QUESTION_THREE_NOT_ANSWERED",
    "FIRST_QUIZ_QUESTION_THREE_SCORE",
    "FIRST_QUIZ_QUESTION_FOUR_ANSWER_ONE",
    "FIRST_QUIZ_QUESTION_FOUR_ANSWER_TWO",
    "FIRST_QUIZ_QUESTION_FOUR_NOT_ANSWERED",
    "FIRST_QUIZ_QUESTION_FOUR_SCORE",
    "FIRST_QUIZ_TOTAL_SCORE",
    "SECOND_QUIZ_QUESTION_ONE",
    "SECOND_QUIZ_QUESTION_ONE_SCORE",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_TWO_ANSWER_THREE",
    "SECOND_QUIZ_QUESTION_TWO_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_TWO_SCORE",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_THREE",
    "SECOND_QUIZ_QUESTION_THREE_ANSWER_FOUR",
    "SECOND_QUIZ_QUESTION_THREE_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_THREE_SCORE",
    "SECOND_QUIZ_QUESTION_FOUR_ANSWER_ONE",
    "SECOND_QUIZ_QUESTION_FOUR_ANSWER_TWO",
    "SECOND_QUIZ_QUESTION_FOUR_NOT_ANSWERED",
    "SECOND_QUIZ_QUESTION_FOUR_SCORE",
    "SECOND_QUIZ_TOTAL_SCORE",

    
],
DEFAULT_DELIMITER = ",";

var delimiter = DEFAULT_DELIMITER;

class Result {

    constructor(data) {
       
        this.sampleNumber = data.id <= 1000054 ? 1 : 2;
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

        this.questionnaireCompletionTime = this.formatTimeInMillis(this.firstConditionStarted - this.questionnaireStarted);
        this.firstConditionCompletionTime = this.formatTimeInMillis(this.firstQuizStarted - this.firstConditionStarted);
        this.firstQuizCompletionTime = this.formatTimeInMillis(this.firstQuizCompleted - this.firstQuizStarted);
        this.secondConditionCompletionTime = this.formatTimeInMillis(this.secondQuizStarted - this.secondConditionStarted);
        this.secondQuizCompletionTime = this.formatTimeInMillis(this.secondQuizCompleted - this.secondQuizStarted);
        this.timeBetweenFirstAndSecondCondition = this.formatTimeInMillis(this.secondConditionStarted - this.firstConditionStarted);
        this.totalExperimentCompletionTime = this.formatTimeInMillis(this.secondQuizCompleted - this.experimentStartedAt);
        // Participiant information
        this.participantID = data.currentParticipant;
        this.participantAge = data.results.questionnaire.age;
        this.participantGender = data.results.questionnaire.gender;
        this.participantSubject = data.results.questionnaire.studies;
        this.participantSemester = data.results.questionnaire.semester;
        this.participantFinishedOOP = data.results.questionnaire.studyprogress.includes("answer1") ? "yes" : "no";
        this.participantFinishedAndroid = data.results.questionnaire.studyprogress.includes("answer2") ? "yes" : "no";
        this.participantFinishedADP = data.results.questionnaire.studyprogress.includes("answer3") ? "yes" : "no";
        this.participantFinishedDB = data.results.questionnaire.studyprogress.includes("answer4") ? "yes" : "no";

        this.participantSelfAssessmentBubbleSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem BubbleSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentSelectionSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem SelectionSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentInsertionSort = data.results.questionnaire["self-assessment"]["Ich habe mich bereits mit dem InsertionSort-Algorithmus auseinandergesetzt."];
        this.participantSelfAssessmentCanDescribe = data.results.questionnaire["self-assessment"]["Ich kann den Ablauf verschiedener Sortieralgorithmen mit Worten beschreiben."];
        this.participantSelfAssessmentCanName = this.sampleNumber == 1 ? data.results.questionnaire["self-assessment"]["Wenn mir die Funktionsweise eines Sortieralgorithmus beschrieben wird kann ich diesen beim Namen nennen."]
        : data.results.questionnaire["self-assessment"]["Wenn mir die Funktionsweise eines Sortieralgorithmus beschrieben wird, kann ich diesen beim Namen nennen."];
        this.participantSelfAssessmentCanDistinguish = data.results.questionnaire["self-assessment"]["Ich kann Sortieralgorithmen anhand ihrer Beschreibung namentlich unterscheiden."];
        this.participantSelfAssessmentScore = this.participantSelfAssessmentBubbleSort + this.participantSelfAssessmentSelectionSort + this.participantSelfAssessmentInsertionSort + 
                                                this.participantSelfAssessmentCanDescribe + this.participantSelfAssessmentCanName + this.participantSelfAssessmentCanDistinguish;
        // Experiment condtions (mode and aglorithm)
        this.firstCondition = data.conditions[0].mode;
        this.firstAlgorithm = data.conditions[0].algorithm;
        this.secondCondition = data.conditions[1].mode;
        this.secondAlgorithm = data.conditions[1].algorithm;
        // Quiz results
        // The following work, assuming that the first entry of data.results.quizzes correspond to the first entry of data.conditions
        // Saving answers for FIRST QUESTION in FIRST QUIZ (text)
        this.firstQuizQuestionOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question1;

        this.firstQuizQuestionOneScore = -1;
        // Saving answers for SECOND QUESTION in FIRST QUIZ (multiple choice)
        this.firstQuizQuestionTwoAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer1") ? "selected" : "not selected";
        this.firstQuizQuestionTwoAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer2") ? "selected" : "not selected";
        this.firstQuizQuestionTwoAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("answer3") ? "selected" : "not selected";
        this.firstQuizQuestionTwoNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question2.includes("noanswer") ? "selected" : "not selected";

        this.firstQuizQuestionTwoScore = this.calculateScore(this.firstAlgorithm, "question2", 
                                            [this.firstQuizQuestionTwoAnswerOne, this.firstQuizQuestionTwoAnswerTwo, this.firstQuizQuestionTwoAnswerThree, this.firstQuizQuestionTwoNotAnswered]);
        // Saving answers for THIRD QUESTION in FIRST QUIZ (multiple choice)
        this.firstQuizQuestionThreeAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer1") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer2") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer3") ? "selected" : "not selected";
        this.firstQuizQuestionThreeAnswerFour = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("answer4") ? "selected" : "not selected";
        this.firstQuizQuestionThreeNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question3.includes("noanswer") ? "selected" : "not selected";

        this.firstQuizQuestionThreeScore = this.calculateScore(this.firstAlgorithm, "question3", 
                                            [this.firstQuizQuestionThreeAnswerOne, this.firstQuizQuestionThreeAnswerTwo, this.firstQuizQuestionThreeAnswerThree, this.firstQuizQuestionThreeAnswerFour,this.firstQuizQuestionThreeNotAnswered]);
        // Saving answers for FOURTH QUESTION in FIRST QUIZ (single choice)
        this.firstQuizQuestionFourAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "item1" ? "selected" : "not selected";
        this.firstQuizQuestionFourAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "item2" ? "selected" : "not selected";
        this.firstQuizQuestionFourNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[0]].question4 === "noanswer" ? "selected" : "not selected";

        this.firstQuizQuestionFourScore = this.calculateScore(this.firstAlgorithm, "question4", 
                                            [this.firstQuizQuestionFourAnswerOne, this.firstQuizQuestionFourAnswerTwo, this.firstQuizQuestionFourNotAnswered]);

        //score of question two to four summed up (question one is not included)
        this.firstQuizTotalScore = this.firstQuizQuestionTwoScore + this.firstQuizQuestionThreeScore + this.firstQuizQuestionFourScore;
        // Saving answers for FIRST QUESTION in SECOND QUIZ (text)
        this.secondQuizQuestionOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question1;

        this.secondQuizQuestionOneScore = -1;
        // Saving answers for SECOND QUESTION in SECOND QUIZ (multiple choice)
        this.secondQuizQuestionTwoAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer1") ? "selected" : "not selected";
        this.secondQuizQuestionTwoAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer2") ? "selected" : "not selected";
        this.secondQuizQuestionTwoAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("answer3") ? "selected" : "not selected";
        this.secondQuizQuestionTwoNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question2.includes("noanswer") ? "selected" : "not selected";

        this.secondQuizQuestionTwoScore = this.calculateScore(this.secondAlgorithm, "question2", 
                                             [this.secondQuizQuestionTwoAnswerOne, this.secondQuizQuestionTwoAnswerTwo, this.secondQuizQuestionTwoAnswerThree, this.secondQuizQuestionTwoNotAnswered]);

        // Saving answers for THIRD QUESTION in SECOND QUIZ (multiple choice)
        this.secondQuizQuestionThreeAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer1") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer2") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerThree = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer3") ? "selected" : "not selected";
        this.secondQuizQuestionThreeAnswerFour = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("answer4") ? "selected" : "not selected";
        this.secondQuizQuestionThreeNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question3.includes("noanswer") ? "selected" : "not selected";

        this.secondQuizQuestionThreeScore = this.calculateScore(this.secondAlgorithm, "question3", 
        [this.secondQuizQuestionThreeAnswerOne, this.secondQuizQuestionThreeAnswerTwo, this.secondQuizQuestionThreeAnswerThree, this.secondQuizQuestionThreeAnswerFour,this.secondQuizQuestionThreeNotAnswered]);

        // Saving answers for FOURTH QUESTION in SECOND QUIZ (single choice)
        this.secondQuizQuestionFourAnswerOne = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "item1" ? "selected" : "not selected";
        this.secondQuizQuestionFourAnswerTwo = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "item2" ? "selected" : "not selected";
        this.secondQuizQuestionFourNotAnswered = data.results.quizzes[Object.getOwnPropertyNames(data.results.quizzes)[1]].question4 === "noanswer" ? "selected" : "not selected";

        this.secondQuizQuestionFourScore = this.calculateScore(this.secondAlgorithm, "question4", 
                                            [this.secondQuizQuestionFourAnswerOne, this.secondQuizQuestionFourAnswerTwo, this.secondQuizQuestionFourNotAnswered]);
        //score of question two to four summed up (question one is not included)
        this.secondQuizTotalScore = this.secondQuizQuestionTwoScore + this.secondQuizQuestionThreeScore + this.secondQuizQuestionFourScore;
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
        return parts.join(delimiter)
    }

    static getCSVHeader() {
        return CSV_HEADERS.map( header => `"${header}"`).join(delimiter);
    }

    static async fromFilePath(path) {
        let content = await fs.promises.readFile(path, {
                encoding: "utf8",
            }),
            data = JSON.parse(content);
        return new Result(data);
    }

    static setDelimiter(customDelimiter = DEFAULT_DELIMITER) {
        delimiter = customDelimiter;
    }

    calculateScore(algorithm, question, answerArray){
        var answersFromProofSheet = ProofSheet[algorithm][question],
            score = 0;
        //"Diese Frage kann ich nicht beantworten." selected, therefore score is 0    
        if(answerArray[answerArray.length - 1] == "selected"){
            return 0;
        }

        //single choice question
        if(question == "question4"){
            if(answerArray[0] == answersFromProofSheet[0]){
                return 1;
            } else {
                return 0;
            }
        }

        //multiple choice question
        for(let i = 0; i < answerArray.length - 1; i++){
            
            if(answerArray[i] == answersFromProofSheet[i]){
                score++;
            } else {
                score--;
            }
        }

        return score > 0 ? score : 0;
    }

    formatTimeInMillis(timeInMillis) {
        var minutes = Math.floor(timeInMillis / 60000);
        var seconds = ((timeInMillis % 60000) / 1000).toFixed(0);
        return seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
}

export default Result;