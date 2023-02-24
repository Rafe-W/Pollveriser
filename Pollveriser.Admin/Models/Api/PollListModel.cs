namespace Pollveriser.Admin.Models.Api;

public class PollListModel
{
    public PollListModel(IEnumerable<PollModel> polls)
    {
        SetPolls(polls);
    }

    public IEnumerable<PollModel>? Polls { get; private set; }
    public int PollsCount { get; private set; }

    public void SetPolls(IEnumerable<PollModel> polls)
    {
        Polls = polls;
        PollsCount = polls?.Count() ?? 0;
    }
}
