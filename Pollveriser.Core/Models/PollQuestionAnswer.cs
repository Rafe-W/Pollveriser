using System.ComponentModel.DataAnnotations;

namespace Pollveriser.Core.Models;

public class PollQuestionAnswer
{
    public virtual Guid QuestionId { get; set; }
    public virtual Guid AnswerId { get; set; }
    
    /// <summary>
    /// Used to identify answers across polls when collating answers - Not required to be specified.
    /// </summary>
    [MaxLength(200)]
    public string CodeName { get; set; }
    /// <summary>
    /// The text to display for this answer when the user is presented the poll
    /// </summary>
    [MaxLength(1000)]
    public string Text { get; set; }
    /// <summary>
    /// The amount of times this answer has been selected
    /// </summary>
    public int TimesChosen { get; set; }

    public bool Active { get; set; }
}
