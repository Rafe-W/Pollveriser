using Microsoft.EntityFrameworkCore;
using Pollveriser.Core.EntityFramework.Entities;

namespace Pollveriser.Core.EntityFramework.Infrastructure;

/// <summary>
/// Not required but supplied as a harness to ensure a DBContext meets requirements
/// </summary>
public interface IPollDbContext
{
    DbSet<Poll> Polls { get;  }
    DbSet<PollQuestion> PollQuestions { get;  }
    DbSet<PollQuestionAnswer> PollQuestionsAnswer { get; }
}
