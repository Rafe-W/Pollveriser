using Microsoft.EntityFrameworkCore;
using Pollveriser.Core.EntityFramework.Infrastructure;

namespace Pollveriser.Database
{
    public class DbFactory : IDbContextProvider
    {
        private IConfiguration _configuration;
        private PollDbContext _dbContext;

        public DbFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public PollDbContext GetDbContext()
        {
            return _dbContext ??= new PollDbContext(_configuration);
        }

        DbContext IDbContextProvider.GetDbContext()
        {
            return GetDbContext();
        }
    }
}
