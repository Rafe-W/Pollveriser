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
