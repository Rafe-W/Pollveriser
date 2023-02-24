using Microsoft.AspNetCore.Components;
using Pollveriser.Admin.Models.Api;
using Pollveriser.Admin.Validation;
using Pollveriser.Core.EntityFramework.Entities;
using Pollveriser.Core.EntityFramework.Infrastructure;

namespace Pollveriser.Admin.Api;

[Route("api/pollveriser-admin")]
//[Authorize(Roles = "PollveriserAdmin")]
public class PollAdminController
{
    private IDbContextProvider _dbContextProvider;

    public PollAdminController(IDbContextProvider dbContextProvider)
    {
        _dbContextProvider = dbContextProvider;
    }

    public async Task<PollQuestionModel> PostQuestion(PollQuestionModel pollQuestionModel)
    {
        if (!StaticValidator.Validate(pollQuestionModel, out List<string> validatorErrors))
        {
            pollQuestionModel.SetErrors(validatorErrors);
            return pollQuestionModel;
        }
        var context = _dbContextProvider.GetDbContext();
        var dbSet = context.Set<PollQuestion>();

        PollQuestion? pollQuestion;
        var isNew = false;
        if (pollQuestionModel.QuestionId != null)
        {
            pollQuestion = dbSet.FirstOrDefault(pq => 
                pq.PollId == pollQuestionModel.PollId
                && pq.QuestionId == pollQuestionModel.QuestionId
            );
            if (pollQuestion == null)
                throw new Exception();
        }
        else
        {
            pollQuestion = new PollQuestion();
            pollQuestion.PollId = pollQuestionModel.PollId;
            pollQuestion.QuestionId = Guid.NewGuid();
            isNew = true;
        }

        pollQuestion.Text = pollQuestionModel.Text;
        pollQuestion.IsMultipleChoice= pollQuestionModel.IsMultipleChoice;

        if (isNew)
        {
            dbSet.Add(pollQuestion);
        }
        else
        {
            dbSet.Update(pollQuestion);
        }

        context.SaveChanges();

        return pollQuestionModel;
    }
}
