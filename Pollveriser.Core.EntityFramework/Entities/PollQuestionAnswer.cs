using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pollveriser.Core.EntityFramework.Entities;

public class PollQuestionAnswer : Pollveriser.Core.Models.PollQuestionAnswer
{
    [Key]
    public override Guid AnswerId { get; set; } = Guid.NewGuid();
    [ForeignKey("Question")]
    public override Guid QuestionId { get; set; }
    public PollQuestion Question { get; set; }
}
