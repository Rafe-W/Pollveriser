var pvr_renderService = {
    buildAnswerPod: function (answer) {
        return `<div class="pvr-poll--question__answer-pod pvr-poll--question__answer-pod--no-answer" data-answer-id="${answer.id}">${answer.text}</div>`;
    },
    buildQuestionContainer: function (question) {
        let answerPods = '';
        for (var x = 0; x < question.answers.length; x++)
            answerPods += pvr_renderService.buildAnswerPod(question.answers[x]);

        return `<div class="pvr-poll--question" data-question-id="${question.id}">
            <div class="pvr-poll--question--text">${question.text}</div>
            <div class="pvr-poll--question--answers">${answerPods}</div>
            </div>`
    },
    buildPoll: function (poll) {
        let questionsHtml = '';
        for (var x = 0; x < poll.questions.length; x++)
            questionsHtml += pvr_renderService.buildQuestionContainer(poll.questions[x]);

        return `<div class="pvr-poll pvr-poll__bottom-right" data-poll-id="${poll.id}">
            <div class="pvr-poll--title">${poll.name}</div>
            <div class="pvr-poll--questions">${questionsHtml}</div>
            </div>`
    },
    applyAnswerData: function (questionContainer, data, selectedAnswerId) {
        let answerDivs = questionContainer.querySelectorAll(".pvr-poll--question__answer-pod") || [];

        for (var x = 0; x < answerDivs.length; x++) {
            let thisAnswerId = answerDivs[x].attributes["data-answer-id"].value;
            let answerData = data.answerCounts[thisAnswerId];

            let chosen = document.createElement('div');

            chosen.classList.add("pvr-poll--question__answer-pod--result");
            if (thisAnswerId == selectedAnswerId)
                chosen.classList.add("pvr-poll--question__answer-pod--result__chosen");

            answerDivs[x].classList.remove("pvr-poll--question__answer-pod--no-answer");
            answerDivs[x].appendChild(chosen);

            chosen.style.setProperty("--pvr-answer-width", '0');
            chosen.style.setProperty("--pvr-hover-width", `${answerData.percentageChosen}%`);
            let addPerc = function () {
                chosen.style.setProperty("--pvr-answer-width", `${answerData.percentageChosen}%`);
            };
            let addText = function () {
                chosen.style.setProperty("--pvr-answer-data", `"${answerData.timesChosen} votes"`);

                chosen.classList.add("pvr-poll--question__answer-pod--result__complete");
            }
            setTimeout(addPerc, 100);
            setTimeout(addText, 1100);
        }
    }
}