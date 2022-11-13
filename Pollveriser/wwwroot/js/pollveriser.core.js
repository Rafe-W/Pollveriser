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