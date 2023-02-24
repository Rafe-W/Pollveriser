using Pollveriser.Core.Models;

namespace Pollveriser.Admin.Models.Api;

public class PollQuestionModel : BasePostableModel
{
    public PollQuestionModel()
    {
        QuestionId = null;
    }

    public PollQuestionModel(PollQuestion pollQuestion)
    {
        PollId = pollQuestion.PollId;
        QuestionId = pollQuestion.QuestionId;
        Text = pollQuestion.Text;
        IsMultipleChoice= pollQuestion.IsMultipleChoice;
    }

    public virtual Guid PollId { get; set; }
    public virtual Guid? QuestionId { get; set; }
    public string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
}
