var pvr_renderModelService = {
    Questions: {
        _questions: [],
        create: function (question, answers, resultData) {
            this._questions.push({
                id: question.id,
                text: question.text,
                answers: answers,
                resultData: resultData
            });
            return this._questions[this._questions.length - 1]
        },
        get: function (questionId) {
            for (var x; x < this._questions.length; x++) {
                if (this._questions[x].id == questionId)
                    return this._questions[x];

                return null;
            }
        }
    },
    Answers: {
        _answers: [],
        create: function (answer, isSelected) {
            this._answers.push({
                id: answer.id,
                text: answer.text,
                selected: isSelected
            });
            return this._answers[this._answers.length - 1]
        },
        get: function (answerId) {
            for (var x; x < this._answers.length; x++) {
                if (this._answers[x].id == answerId)
                    return this._answers[x];

                return null;
            }
        }
    },
    Polls: {
        _polls: [],
        create: function (poll, questions) {
            this._polls.push({
                id: poll.id,
                name: poll.name,
                description: poll.description,
                resultsOnly: poll.resultsOnly,
                activeTo: poll.activeTo,
                questions: questions
            });
            return this._polls[this._polls.length - 1]
        },
        get: function (pollId) {
            for (var x; x < this._polls.length; x++) {
                if (this._polls[x].id == pollId)
                    return this._polls[x];

                return null;
            }
        }
    }
};

var pvr_renderService = {
    renderPoll: function (renderArguments) {
        class Answer extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    id: props.id,
                    text: props.text,
                    selected: props.selected,
                    answerData: props.answerData
                };
                this.setQuestionResultData = props.setResultData;
                this.questionId = props.questionId;
                this.onSelect = this.onSelect.bind(this);
            }

            async onSelect() {
                await pvr_coreService.selectAnswer(this.state.id, this.questionId, this.setQuestionResultData);
            }

            __renderDatabar() {
                if (this.state.answerData == null) {
                    return <span></span>
                }

                var classes = "pvr-poll--question__answer-pod--result pvr-poll--question__answer-pod--result__complete"
                if (this.state.selected) {
                    classes += " pvr-poll--question__answer-pod--result__chosen";
                }

                var percentage = `${this.state.answerData.percentageChosen}%`;
                var votes = `"${this.state.answerData.timesChosen} votes"`;

                return <div
                    className={classes}
                    style={{
                        "--pvr-answer-width": percentage,
                        "--pvr-hover-width": percentage,
                        "--pvr-answer-data": votes,
                    }}
                ></div>
            }

            render() {
                return <div className="pvr-poll--question__answer-pod pvr-poll--question__answer-pod--no-answer" onClick={this.onSelect} >{this.state.text} {this.__renderDatabar()} </div>
            }
        }

        class Question extends React.Component {
            constructor(props) {
                super(props);
                console.log(props.resultData);
                this.state = { id: props.id, text: props.text, answers: props.answers, resultData: props.resultData };
                this.answerComponents = [];

                this.setResultData = this.setResultData.bind(this);
                this.generateAnswers = this.generateAnswers.bind(this);
            }

            setResultData(data) {
                this.setState({ resultData: data });
            }

            generateAnswers() {
                this.answerComponents = this.state.answers.map(a => {
                    var resultData = this.state.resultData;
                    var answerData = resultData != null ? resultData.answerCounts[a.id] : null;
                    var key = a.id + (answerData != null ? "-nodata" : "data");
                    return <Answer key={key} id={a.id} text={a.text} selected={a.selected} questionId={this.state.id} answerData={answerData} setResultData={this.setResultData} />
                });
            }

            render() {
                this.generateAnswers()
                return (
                    <div className="pvr-poll--question" data-question-id={this.state.id}>
                        <div className="pvr-poll--question--text">{this.state.text}</div>
                        <div className="pvr-poll--question--answers">
                            {this.answerComponents}
                        </div>
                    </div>
                );
            }
        };

        class PollContainer extends React.Component {
            constructor(props) {
                super(props);
                this.state = { id: props.id, name: props.name, questions: props.questions };
            }

            render() {
                return (
                    <div className="pvr-poll pvr-poll__bottom-right" data-poll-id={this.state.id}>
                        <div className="pvr-poll--title">{this.state.name}</div>
                        <div className="pvr-poll--questions">
                            {this.state.questions.map(q => (<Question key={q.id} id={q.id} text={q.text} answers={q.answers} resultData={q.resultData} />))}
                        </div>
                    </div>
                )
            }
        };

        var root = ReactDOM.createRoot(
            renderArguments.targetElement
        )

        var pollArgument = renderArguments.poll;
        var questions = [];
        for (var q = 0; q < pollArgument.questions.length; q++) {
            var question = pollArgument.questions[q];
            var answers = [];

            for (var a = 0; a < question.answers.length; a++) {
                var answer = question.answers[a];
                answers.push(pvr_renderModelService.Answers.create(answer, answer.id == renderArguments.existingAnswerId))
            }

            console.log(renderArguments.resultData);
            questions.push(pvr_renderModelService.Questions.create(question, answers, renderArguments.resultData));
        }

        var pollModel = pvr_renderModelService.Polls.create(pollArgument, questions);

        root.render(<PollContainer id={pollModel.Id} name={pollModel.name} questions={pollModel.questions} />);
    }
}