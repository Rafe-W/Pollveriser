using Pollveriser.Core.Models;

namespace Pollveriser.Core;

public interface IPollRepository
{
    /// <summary>
    /// Load all currently active polls.
    /// To be efficient, only load polls that are active based on the IsActive field, as well as are within the ActiveFrom to ActiveTo/ResultsAvaliableTo fields. (see docs for more info)
    /// </summary>
    /// <returns></returns>
    IEnumerable<Poll> GetActivePolls();

   /// <summary>
   /// Load the associated question and answers for a given poll. 
   /// </summary>
   /// <param name="pollId"></param>
   /// <param name="questions"></param>
   /// <param name="answers"></param>
    void GetPollQuestionsAndAnswers(Guid pollId, out IEnumerable<PollQuestion> questions, out IEnumerable<PollQuestionAnswer> answers);

    /// <summary>
    /// Increment the <see cref="PollQuestionAnswer.TimesChosen"/> field by 1. 
    /// </summary>
    /// <param name="answerId">The answer chosen by the user</param>
    void IncreaseCountOnAnswer(Guid answerId);
    List<PollQuestionAnswer> GetQuestionAnswersWithAnswerId(Guid answerId);
    List<PollQuestionAnswer> GetQuestionAnswers(Guid questionId);
}
