using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pollveriser.Core.Models;

public class PollQuestion
{
    public virtual Guid PollId { get; set; }
    public virtual Guid QuestionId { get; set; }
    public string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
}
