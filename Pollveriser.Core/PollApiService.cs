using Pollveriser.Core.Models;
using Pollveriser.Core.Models.Api;

namespace Pollveriser.Core;

public class PollApiService
{
    private readonly IPollRepository _pollRepository;

    public PollApiService(IPollRepository pollRepository)
    {
        _pollRepository = pollRepository;
    }

    public List<PopulatedPoll> GetPollsForPage(PollRequestParameters requestParameters)
    {
        var validPolls = new List<PopulatedPoll>();

        var activePolls = GetActivePolls();

        var currentDateTime = DateTime.Now;

        foreach(var poll in activePolls)
        {
            if (!poll.IsActive)
                continue;

            if (!poll.IsValidForCurrentDate(currentDateTime))
                continue;

            if (!poll.HasMatchingTag(requestParameters.DataTags))
                continue;

            if (!poll.HasMatchingPath(requestParameters.CurrentUrlPath))
                continue;

            _pollRepository.GetPollQuestionsAndAnswers(poll.Id, out IEnumerable<PollQuestion> questions, out IEnumerable<PollQuestionAnswer> answers);
            validPolls.Add(PopulatedPoll.CreateFromData(poll, questions, answers));
        }

        return validPolls;
    }

    public LatestQuestionAnswers GetAnswersForQuestion(Guid questionId)
    {
        var questionWithAnswers =_pollRepository.GetQuestionAnswers(questionId);

        return LatestQuestionAnswers.CreateFromData(questionWithAnswers);
    }

    public LatestQuestionAnswers ChoseAnswer(Guid answerId)
    {
        _pollRepository.IncreaseCountOnAnswer(answerId);

        var questionWithAnswers = _pollRepository.GetQuestionAnswersWithAnswerId(answerId);

        return LatestQuestionAnswers.CreateFromData(questionWithAnswers);
    }

    private IEnumerable<Poll> GetActivePolls()
    {
        return _pollRepository.GetActivePolls();
    }
}
