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