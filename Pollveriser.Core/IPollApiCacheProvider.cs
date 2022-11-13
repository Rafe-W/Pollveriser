using Pollveriser.Core.Models;

namespace Pollveriser.Core;

public interface IPollApiCacheProvider
{
    bool TryGetAllPolls(out List<Poll>? polls);
    void CacheAllPolls(List<Poll> polls);

    bool TryGetPollData(Guid pollId, out CachedPollData? data);
    void CachePollData(Guid pollId, List<PollQuestion> questions, List<PollQuestionAnswer> questionAnswers);
}

public class CachedPollData {
    public List<PollQuestion> Questions { get; set; }
    public List<PollQuestionAnswer> Answers { get; set; }
}