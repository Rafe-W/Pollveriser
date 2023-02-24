using Pollveriser.Admin.Models.Api;

namespace Pollveriser.Admin.Validation;

internal static class StaticValidator
{

    public static  bool Validate(PollQuestionModel pollQuestionModel, out List<string> errors)
    {
        errors = new List<string>();
        if (pollQuestionModel == null)
        {
            errors.Add("No data received, please try again");
            return false;
        }

        if (pollQuestionModel.PollId == default || pollQuestionModel.PollId == Guid.Empty)
        {
            errors.Add("No poll id associated with this question, please reload the page");
        }

        if (string.IsNullOrEmpty(pollQuestionModel.Text))
        {
            errors.Add("Please enter question text");
        }

        return errors.Any();
    }
}