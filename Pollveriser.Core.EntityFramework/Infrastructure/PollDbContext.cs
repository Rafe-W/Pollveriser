using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pollveriser.Core.EntityFramework.Entities;

namespace Pollveriser.Core.EntityFramework.Infrastructure;

public class PollDbContext : DbContext, IPollDbContext
{
    private readonly IConfiguration _configuration;

    public DbSet<Poll> Polls { get; set; }
    public DbSet<PollQuestion> PollQuestions { get; set; }
    public DbSet<PollQuestionAnswer> PollQuestionsAnswer { get; set; }

    public PollDbContext(IConfiguration configuration) : base()
    {
        _configuration = configuration;
    }

    public PollDbContext()
    {
        var builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.json");
        _configuration = builder.Build();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_configuration.GetConnectionString("PollveriseDb"));

        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //modelBuilder.Entity<PollQuestion>().HasKey(pq => new { pq.PollId, pq.QuestionId });
        //modelBuilder.Entity<PollQuestionAnswer>().HasKey(pq => new { pq.QuestionId, pq.AnswerId });

        base.OnModelCreating(modelBuilder);
    }
}
