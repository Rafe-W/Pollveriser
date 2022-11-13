using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Pollveriser.Core.Models;

public class Poll
{
    public virtual Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public PollType PollType { get; set; }
    public DateTime? ActiveFrom { get; set; }
    public DateTime? ActiveTo { get; set; }
    public DateTime? ResultsAvaliableTo { get; set; }
    public bool IsActive { get; set; }

    //Targeting rules
    /// <summary>
    /// Regex string
    /// If NOT specified, this rule is ignored. It will show if it matches any other rules
    /// If specified, it will apply a REGEX to the path on the current page. (Leave blank to target all pages)
    /// </summary>
    public string? MustMatchPath { get; set; }

    internal bool IsValidForCurrentDate(DateTime currentDateTime)
    {
        if (ActiveFrom is not null && currentDateTime < ActiveFrom)
            return false;

        if (ResultsAvaliableTo is not null && currentDateTime > ResultsAvaliableTo)
            return false;
        else if (ActiveTo is not null && currentDateTime > ActiveFrom)
            return false;

        return true;
    }

    internal bool HasMatchingTag(List<string> dataTags)
    {
        var tags = InsertForDataTags?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        var allTags = tags.Union(MustMatchTags?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>()).ToList();

        return allTags.Count == 0 || allTags.Any(pt => dataTags.Contains(pt));
    }

    internal bool HasMatchingPath(string currentUrlPath)
    {
        if (MustMatchPath is null)
            return true;

        var pathRegex = new Regex(MustMatchPath);

        return pathRegex.IsMatch(currentUrlPath);
    }

    /// <summary>
    /// Comma separated list of tags
    /// If NOT specified, this rule is ignored. It will show if it matches any other rules
    /// If specified, if the poll matches any of the tags included in the request, it will be returned.
    /// </summary>
    public string? MustMatchTags { get; set; }
    /// <summary>
    /// Comma separated list of tags
    /// If PollType  is set to "Inline", if the tag is on page, it will be inserted at any areas on the page with a tag matching data-poll-tag="<tag>"
    /// This will also cause the poll to be filtered out if not present
    /// </summary>
    public string? InsertForDataTags { get; set; }

}
