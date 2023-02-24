using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Pollveriser.Core.EntityFramework.Infrastructure;

public class DbFactory : IDbContextProvider
{
    private IConfiguration _configuration;
    private PollDbContext _dbContext;

    public DbFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public DbContext GetDbContext()
    {
        return _dbContext ??= new PollDbContext(_configuration);
    }

    DbContext IDbContextProvider.GetDbContext()
    {
        return GetDbContext();
    }
}
