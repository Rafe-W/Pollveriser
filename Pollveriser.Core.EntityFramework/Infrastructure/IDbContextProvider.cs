using Microsoft.EntityFrameworkCore;

namespace Pollveriser.Core.EntityFramework.Infrastructure
{
    public interface IDbContextProvider
    {
        DbContext GetDbContext();
    }
}