using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pollveriser.Core.Models.Api;

public class PopulatedPoll
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime? ActiveTo { get; set; }
    public bool ResultsOnly { get; set; }
    public List<string> InsertForDataTags { get; set; }
    public List<Question> Questions { get; set; }

    internal static PopulatedPoll CreateFromData(Poll poll, IEnumerable<PollQuestion> questions, IEnumerable<PollQuestionAnswer> answers)
    {
        return new PopulatedPoll
        {
            Id = poll.Id,
            Name = poll.Name,
            Description = poll.Description,
            ActiveTo = poll.ActiveTo,
            ResultsOnly = DateTime.Now > poll.ActiveTo,
            InsertForDataTags = poll.InsertForDataTags?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>(),
            Questions = questions.Select(q => CreateFromModel(q, answers.Where(a => a.QuestionId == q.QuestionId))).ToList()
        };
    }

    private static Question CreateFromModel(PollQuestion pollQuestion, IEnumerable<PollQuestionAnswer> answers)
    {
        return new Question
        {
            Id = pollQuestion.QuestionId,
            IsMultipleChoice = pollQuestion.IsMultipleChoice,
            Text = pollQuestion.Text,
            Answers = answers.Select(CreateFromModel).ToList()
        };
    }

    private static Answer CreateFromModel(PollQuestionAnswer answer)
    {
        return new Answer
        {
            Id = answer.AnswerId,
            Text = answer.Text
        };
    }
}

public class Question
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public bool IsMultipleChoice { get; set; }
    public List<Answer> Answers { get; set; }
}

public class Answer
{
    public Guid Id { get; set; }
    public string Text { get; set; }
}