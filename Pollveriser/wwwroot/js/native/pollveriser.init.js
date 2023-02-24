var pvr_init = function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(async function () {
        var polls = await pvr_coreService.getPollsForCurrentPage();

        if (polls.length == 0)
            return;

        let poll = polls[0];

        var existingAnswer = pvr_clientStoreService.getClientPollVote(poll.questions[0].id);

        let pollHtml = pvr_renderService.buildPoll(poll);
        let container = document.createElement('div');
        container.innerHTML = pollHtml;

        let selectAnswer = async function (evTarget, shouldSubmit) {
            let parent = evTarget.parentElement;

            let answerId = evTarget.attributes["data-answer-id"].value;
            let questionId = parent.parentElement.attributes["data-question-id"].value;

            if (shouldSubmit) {
                pvr_coreService.selectAnswer(answerId, questionId, function (data) {
                    pvr_renderService.applyAnswerData(parent, data, answerId);
                });
            }
            else {
                let data = await pvr_apiService.getQuestionAnswers(questionId);
                pvr_renderService.applyAnswerData(parent, data, answerId);
            }
        }

        if (existingAnswer) {
            var selectedAnswerElement = container.querySelectorAll(`.pvr-poll--question__answer-pod[data-answer-id="${existingAnswer}"]`)[0];
            selectAnswer(selectedAnswerElement, false)
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
};

pvr_init();