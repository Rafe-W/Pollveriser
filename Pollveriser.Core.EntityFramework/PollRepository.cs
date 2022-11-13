using Microsoft.EntityFrameworkCore;
using Pollveriser.Core.Models;

namespace Pollveriser.Core.EntityFramework;

public class PollRepository : IPollRepository
{
    private readonly IDbContextProvider _dbContextProvider;

    public PollRepository(IDbContextProvider dbSetProvider)
    {
        _dbContextProvider = dbSetProvider;
    }

    public IEnumerable<Poll> GetActivePolls()
    {
        var currentDate = DateTime.Now;
        return _dbContextProvider.GetDbContext().Set<Entities.Poll>().Where(p => p.IsActive && (p.ActiveFrom == null || currentDate > p.ActiveFrom)
            && ((p.ResultsAvaliableTo != null && currentDate < p.ResultsAvaliableTo)  || (p.ActiveTo == null || currentDate < p.ActiveTo))
        ).ToList();
    }

    public void GetPollQuestionsAndAnswers(Guid pollId, out IEnumerable<PollQuestion> questions, out IEnumerable<PollQuestionAnswer> answers)
    {
        var entityQuestions = _dbContextProvider.GetDbContext().Set<Entities.PollQuestion>().Where(q => q.PollId == pollId).Include(q => q.Answers).ToList();

        answers = entityQuestions.SelectMany(q => q.Answers).ToList();
        questions = entityQuestions;
    }

    public List<PollQuestionAnswer> GetQuestionAnswers(Guid questionId)
    {
        var dbContext = _dbContextProvider.GetDbContext();
        var answerSet = dbContext.Set<Entities.PollQuestionAnswer>();

        return answerSet.Where(a => a.QuestionId == questionId).ToList() //Force the db call to stop errors
            .Cast<Models.PollQuestionAnswer>().ToList();
    }

    public List<PollQuestionAnswer> GetQuestionAnswersWithAnswerId(Guid answerId)
    {
        //Must be a better way of doing this.
        var dbContext = _dbContextProvider.GetDbContext();
        var answerSet = dbContext.Set<Entities.PollQuestionAnswer>();
        var questionId = answerSet.Where(a => a.AnswerId == answerId).Select(a => a.QuestionId).First();

        return answerSet.Where(a => a.QuestionId == questionId).ToList() //Force the db call to stop errors
            .Cast<Models.PollQuestionAnswer>().ToList();
    }

    public void IncreaseCountOnAnswer(Guid answerId)
    {
        var dbContext = _dbContextProvider.GetDbContext();
        var answerDbSet = dbContext.Set<Entities.PollQuestionAnswer>();
        var answer = answerDbSet.First(f => f.AnswerId == answerId);

        answer.TimesChosen++;

        var entry = answerDbSet.Entry(answer);
        entry.Property(a => a.TimesChosen).IsModified = true;
        entry.State = EntityState.Modified;

        dbContext.SaveChanges();
    }
}
