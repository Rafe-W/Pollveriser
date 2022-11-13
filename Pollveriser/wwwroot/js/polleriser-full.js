var pvr_apiService = {
    getActivePolls: async function (currentPath, dataTags) {
        let requestParameters = {
            CurrentUrlPath: currentPath,
            DataTags: dataTags
        };

        let response = await fetch('/api/pollveriser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestParameters)
        });

        let polls = await response.json();

        return polls;
    },
    submitAnswer: async function (answerId) {
        let response = await fetch(`/api/pollveriser?answerId=${answerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answerId: answerId })
        });

        let data = await response.json();

        return data;
    },
    getQuestionAnswers: async function (questionId) {
        let response = await fetch(`/api/pollveriser?questionId=${questionId}`, {
            method: 'GET'
        });

        let data = await response.json();

        return data;
    }
}
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
var pvr_clientStoreService = {
	__CONST_storageKey: "pvr_data",
	__setLocalStorage: function (data) {
		localStorage.setItem(this.__CONST_storageKey, JSON.stringify(data));
	},
	__getLocalStorage: function (data) {
		return JSON.parse(localStorage.getItem(this.__CONST_storageKey) || "{}");
    },
	getClientPollVote: function (questionId) {
		var data = this.__getLocalStorage();

		return data[questionId];
	},
	setClientPollVote: function (questionId, answerId) {
		var data = this.__getLocalStorage();

		data[questionId] = answerId;

		this.__setLocalStorage(data);
	},
	clearClientPollVote: function (questionId) {
		var data = this.__getLocalStorage();

		data[questionId] = false;

		this.__setLocalStorage(data);
    }
}

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function parseHTML(str) {
    const tmp = document.implementation.createHTMLDocument('');
    tmp.body.innerHTML = str;
    return [...tmp.body.childNodes];
}


var PVR_VAR_DataTags = [];
var PVR_VAR_CurrentPath = '';

ready(async function () {
    let PVR_CONST_ENABLE_TAG = "[data-pvr-enable]";

    let anyPollDataTags = document.querySelector(PVR_CONST_ENABLE_TAG) || [];
    if (anyPollDataTags.length == 0)
        return;

    var PVR_CONST_TARGET_TAG = "[data-pvr-tag]";

    let dataTagsElements = document.querySelector(PVR_CONST_TARGET_TAG) || [];

    for (var x = 0; x < dataTagsElements.length; x++) {
        var tags = dataTagsElements[x].attributes[PVR_CONST_TARGET_TAG].value.split(',');
        for (var y = 0; y < tags.length; y++) {
            PVR_VAR_DataTags.push(tags[y]);
        }
    }

    PVR_VAR_CurrentPath = window.location.pathname;

    let polls = await pvr_apiService.getActivePolls(PVR_VAR_CurrentPath, PVR_VAR_DataTags);

    if (polls.length == 0)
        return;

    let poll = polls[0];

    let pollHtml = pvr_renderService.buildPoll(poll);
    let container = document.createElement('div');
    container.innerHTML = pollHtml;

    let selectAnswer = async function (evTarget, shouldSubmit) {
        let parent = evTarget.parentElement;

        let answerId = evTarget.attributes["data-answer-id"].value;
        let questionId = parent.parentElement.attributes["data-question-id"].value;
        let data = false;
        if (shouldSubmit) {
            data = await pvr_apiService.submitAnswer(answerId);
            pvr_clientStoreService.setClientPollVote(questionId, answerId);
        }
        else
            data = await pvr_apiService.getQuestionAnswers(questionId)

        pvr_renderService.applyAnswerData(parent, data, answerId);
    }

    var existingAnswer = pvr_clientStoreService.getClientPollVote(poll.questions[0].id);

    if (existingAnswer) {
        selectAnswer(container.querySelectorAll(`.pvr-poll--question__answer-pod[data-answer-id="${existingAnswer}"]`)[0], false)
    }
    else {
        let handleContainerClick = function (e) {
            if (e.target.closest('.pvr-poll--question__answer-pod')) {
                container.removeEventListener('click', handleContainerClick);
                selectAnswer(e.target, true);
            }

        }
        container.addEventListener('click', handleContainerClick)
    }


    document.body.appendChild(container);
});