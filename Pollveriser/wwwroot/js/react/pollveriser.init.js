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
        var resultData = null;

        if (existingAnswer != null) {
            resultData = await pvr_apiService.getQuestionAnswers(poll.questions[0].id);
        }

        console.log(resultData);

        var pollRenderArgs = {
            poll: poll,
            existingAnswerId: existingAnswer,
            resultData: resultData,
            targetElement: document.getElementById("pollveriser_target"),
        }

        pvr_renderService.renderPoll(pollRenderArgs);
    });
};

pvr_init();