using System.ComponentModel.DataAnnotations;

namespace Pollveriser.Core.EntityFramework.Entities;

public class Poll : Pollveriser.Core.Models.Poll
{
    [Key]
    public override Guid Id { get; set; } = Guid.NewGuid();
    public List<PollQuestion> Questions { get; set; }
}
