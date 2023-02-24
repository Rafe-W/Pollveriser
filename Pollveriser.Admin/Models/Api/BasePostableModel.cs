namespace Pollveriser.Admin.Models.Api;

public abstract class BasePostableModel
{
    public bool HasErrors { get; private set; }
    public List<string> Errors { get; private set; }

    public void SetErrors(List<string> errors)
    {
        Errors = errors;
        HasErrors = errors.Any();
    }
}
