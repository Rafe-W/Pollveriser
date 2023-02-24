var PVR_VAR_DataTags = [];
var PVR_VAR_CurrentPath = '';
const PVR_CONST_ENABLE_TAG = "[data-pvr-enable]";
const PVR_CONST_TARGET_TAG = "[data-pvr-tag]";

var pvr_coreService = {
    selectAnswer: async function (answerId, questionId, dataCallback) {
        let data = await pvr_apiService.submitAnswer(answerId);
        pvr_clientStoreService.setClientPollVote(questionId, answerId);

        if (typeof dataCallback == "function") {
            dataCallback(data);
        }
    },
    getPollsForCurrentPage: async function () {
        let anyPollDataTags = document.querySelector(PVR_CONST_ENABLE_TAG) || [];
        if (anyPollDataTags.length == 0)
            return;

        let dataTagsElements = document.querySelector(PVR_CONST_TARGET_TAG) || [];

        for (var x = 0; x < dataTagsElements.length; x++) {
            var tags = dataTagsElements[x].attributes[PVR_CONST_TARGET_TAG].value.split(',');
            for (var y = 0; y < tags.length; y++) {
                PVR_VAR_DataTags.push(tags[y]);
            }
        }

        PVR_VAR_CurrentPath = window.location.pathname;

        return await pvr_apiService.getActivePolls(PVR_VAR_CurrentPath, PVR_VAR_DataTags);
    }
}
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
/*
    var pollRenderArgs = {
            poll: poll,
            existingAnswerId: existingAnswer,
            resultsData: resultsData,
            targetElement: document.body,
        }
*/

var pvr_renderService = {
    renderPoll: function (renderArguments) {
        function PollContainer() {

        };
        function Question() {

        };
        function Answer() {

        };

        ReactDOM.render(
            <title><h1>Wow!</h1></title>,
            renderArguments.targetElement
        )
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
        var resultsData = {};

        if (existingAnswer) {
            resultsData = await pvr_apiService.getQuestionAnswers(questionId);
        }

        var pollRenderArgs = {
            poll: poll,
            existingAnswerId: existingAnswer,
            resultsData: resultsData,
            targetElement: document.body,
        }

        pvr_renderService.renderPoll(pollRenderArgs);
    }
}