using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pollveriser.Core.EntityFramework.Entities;

public class PollQuestion : Pollveriser.Core.Models.PollQuestion
{   
    [Key]
    public override Guid QuestionId { get; set; } = Guid.NewGuid();
    [ForeignKey("Poll")]
    public override Guid PollId { get; set; } 
    public Poll Poll { get; set; }

    public List<PollQuestionAnswer> Answers { get; set; }
}
