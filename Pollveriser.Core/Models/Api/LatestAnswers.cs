namespace Pollveriser.Core.Models.Api;

public class LatestQuestionAnswers
{
    public Dictionary<string, AnswerData> AnswerCounts {  get; set; } = new Dictionary<string, AnswerData>();

    internal static LatestQuestionAnswers CreateFromData(List<PollQuestionAnswer> questionWithAnswers)
    {
        var sumAnswerCount = questionWithAnswers.Sum(a => a.TimesChosen);

        return new LatestQuestionAnswers
        {
            AnswerCounts = questionWithAnswers.ToDictionary(answer => answer.AnswerId.ToString(), answer => new AnswerData(answer.TimesChosen, sumAnswerCount))
        };
    }
}

public class AnswerData
{
    public int TimesChosen { get; set; }
    public double PercentageChosen { get; set; }

    public AnswerData(int timesChosen, int sumAnswers)
    {
        TimesChosen = timesChosen;
        PercentageChosen = Math.Round((timesChosen / (double)sumAnswers) * 100, 2);
    }
}
