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