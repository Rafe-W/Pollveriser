using Pollveriser.Core;
using Pollveriser.Core.Models;

namespace Pollveriser.Admin.Models.Api;

public class PollModel
{
    public PollModel()
    {

    }

    public PollModel(Poll poll)
    {
        Id = poll.Id;
        Name = poll.Name;
        Description= poll.Description;
        PollType = poll.PollType;
        ActiveFrom= poll.ActiveFrom;
        ActiveTo= poll.ActiveTo;
        ResultsAvaliableTo= poll.ResultsAvaliableTo;
        IsActive= poll.IsActive;
        MustMatchPath= poll.MustMatchPath;

        IsPollLive = poll.IsValidForCurrentDate(DateTime.Now);
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public PollType PollType { get; set; }
    public DateTime? ActiveFrom { get; set; }
    public DateTime? ActiveTo { get; set; }
    public DateTime? ResultsAvaliableTo { get; set; }
    public bool IsActive { get; set; }

    public bool IsPollLive { get; set; }

    public string? MustMatchPath { get; set; }
    public string? MustMatchTags { get; set; }
    public string? InsertForDataTags { get; set; }

    /// <summary>
    /// Only used on load.
    /// </summary>
    public List<PollQuestionModel> Questions { get; set; }
}