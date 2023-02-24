using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Pollveriser.Pages
{
    public class React : PageModel
    {
        private readonly ILogger<React> _logger;

        public React(ILogger<React> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}