using Pollveriser.Core.Models;

namespace Pollveriser.Core.Defaults;

/// <summary>
/// Default cache provider - AKA no caching :(
/// </summary>
internal class DefaultCacheProvider : IPollApiCacheProvider
{
    public void CacheAllPolls(List<Poll> polls)
    {

    }

    public void CachePollData(Guid pollId, List<PollQuestion> questions, List<PollQuestionAnswer> questionAnswers)
    {

    }

    public bool TryGetAllPolls(out List<Poll>? polls)
    {
        polls = null;
        return false;
    }

    public bool TryGetPollData(Guid pollId, out CachedPollData? data)
    {
        data = null;
        return false;
    }
}
