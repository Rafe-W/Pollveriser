using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pollveriser.Core;
using Pollveriser.Core.Models.Api;

namespace Pollveriser.Api
{
    [Route("api/pollveriser")]
    [ApiController]
    public class PollController : ControllerBase
    {
        private PollApiService _pollApiService;

        public PollController(PollApiService pollApiService)
        {
            _pollApiService = pollApiService;
        }

        [HttpGet]
        public LatestQuestionAnswers Get(Guid questionId)
        {
            return _pollApiService.GetAnswersForQuestion(questionId);
        }

        [HttpPost]
        public List<PopulatedPoll> Post(PollRequestParameters requestParameters)
        {
            return _pollApiService.GetPollsForPage(requestParameters);
        }

        /// <summary>
        /// Adds an answer to the chosen answer, and returns the current results
        /// </summary>
        [HttpPatch]
        public LatestQuestionAnswers Patch(Guid answerId)
        {
            if (answerId == Guid.Empty)
                throw new ArgumentException(answerId.ToString());
            return _pollApiService.ChoseAnswer(answerId);
        }
    }
}
