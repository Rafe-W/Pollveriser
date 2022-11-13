using Microsoft.EntityFrameworkCore;
using Pollveriser.Core.EntityFramework.Entities;

namespace Pollveriser.Core.EntityFramework
{
    public interface IDbContextProvider
    {
        DbContext GetDbContext();
    }
}