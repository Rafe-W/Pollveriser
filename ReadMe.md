# Pollveriser
> Version: 0.0.1

> ## Under construction 🏗

A simple .NET 6.0 plugin to enable polling with minimal set up requirements, and full flexibility on how you use it.

# What is it for?

When you want to create a poll and track the results without needing any integration with third party system. (Meaning you own the data!)
That means no external API calls, and all the data stays in your system.

The most basic use case (hosting a poll) would require
	* A data repository that can receive CRUD operations via the `IPollRepository` interface
	* A website with URL paths to target polls for certain pages (or every page!)
		* Add data-poll-* tags to an element on the page to trigger a poll if set up
	* Register the `PollveriseController` so it's accessible on your application 🏗 (example in project)
	* Register the PollveriseDependencies 🏗
	* Include the `pollverise-full.js` file in your scripts

> I've included a pre-built EntityFrameworkCore implementation for the Repository. Just add the required classes to your DB context and you're all good to go, and register it against the `IDbContextProvider` interface.
	
## Flexible
You can mix and match what you use from this solution, enabling you to implement this solution as a quick fix, and add your own requirements as you need.

For example
	* You want Pollverises server side capabilities (AKA the API and data repository class) 
	* You want custom client side scripting for displaying polls

Just build your client scripts against the contracts, and you're done! You might want to use the `pollverise.api.js` script to make your API calls easier

## Secure voting 🏗
Want to enforce more security over who/how many times people can vote? (by default, it'll track votes in a browsers local storage) 
	* Implement the IPollVoteAuthorisation class and override with your implementation during DI.
	* Now you can choose WHO is shown the poll `IPollVoteAuthorisation.CanTakePartInPoll` (you can still let ineligible voters view results!)
	* And stop them voting multiple times server side!
	
Want users to be able to create their own polls? 🏗
	* I am still working out how best to do this...

See our full documentation (TODO) for more ways you can customise your implementation


## Admin site 🏗
Now you might still be wondering, that all sounds nice, but I bet I'm still going to end up having to set up each poll.

So, this bit is really up to you. If you aren't needing many polls, I've included some SQL scripts in this repository to simplify as much as possible creating new polls.

I've also got a separate project that includes has an admin site.
Clone this project, and update the depencies to work with your chosen setup. (Admin is set up by default based on an entity framework core implementation, all included in the app itself.)
> I *do not* recommend making a publicly avaliable site with this application. Please read the documentation for more information.
You can use this site locally to connect to your database and set up the polls through our easy to use application.

You might want to instead write your own bespoke version. That's fine too! If you want to include some commonly required functionality, have a look at the `Pollveriser.Admin` package here. 
This builds on the classes I have here and provides some "Ready to go" functionality that you can hook your UI up to.