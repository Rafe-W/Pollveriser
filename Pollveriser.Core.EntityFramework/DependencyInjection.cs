using Pollveriser.Core;
using Pollveriser.Core.EntityFramework;
using Pollveriser.Core.EntityFramework.Infrastructure;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddPollveriserWithEntityFramework<TDbContextProvider>(this IServiceCollection services) where TDbContextProvider : class, IDbContextProvider
    {
        services.AddScoped<DbFactory>();
        services.AddScoped<IDbContextProvider, TDbContextProvider>();
        services.AddScoped<IPollRepository, PollRepository>();
        services.AddScoped<PollApiService>();
    }

    public static void AddPollveriserWithEntityFramework(this IServiceCollection services)
    {
        services.AddPollveriserWithEntityFramework<DbFactory>();
    }
}
