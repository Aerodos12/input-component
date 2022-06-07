# Contributor's Guide to InputComponent.

First of all, thanks for supporting and appreciating the full potential of this 
4-year-old module. It was a struggle and a blessing, but the thought is definitely 
what counts. However, we need to take a history lessson.

## The history and vision of InputComponent.

When this module started, InputComponent was just meant for handling simple input.
However, things took off when [https://github.com/RoStrap](Rostrap) came to town.
Events were becoming commonplace, inputs were made more thoughtful for the player, 
and the code itself became more organized. However, problems arised over time.

As a result, InputComponent V2 was made.

V2 uses PseudoInstances instead of raw metatables (a lua thing). This makes the code 
more organized and also more memory-friendly (garbage collection is taken into account).
It was during 2021 when I decided (without thinking about it more) that one day I will
make this module open-source. And now the time has come.

Overall, the vision of the module (and goal) is to make inputs more customizable and 
cleaner **internally** (this is key). ContextActionService may be helpful, but it can also 
cause issues when inputs are polled or on an axis. So, I made axes a common feature. GuiService
usually is used for selection. However, (even today) the selection is subpar compared to InputComponent's 
custom selection system. Granted, more code is needed to set it up, but that is the point. The point is to make
the selection system yours. ProximityPrompts in vanilla form aren't what I had in mind for interactions, but they are used
this system.

## How do I come in?

There are many ways to contribute. Here they are, organized:

1. Code
    To contribute code-wise is going to require an understanding of the module.
    However, there are some things that can be done in this department:
    - Feature Suggestions
    - Refactoring
    - Typescript Insights (if you have any)
    - Bugfixes (when needed)
2. Equipment/Resources
    In order for some platforms to fully appear (such as the VR and - to an extent - the Mobile platforms) in the module,
    either equipment or money (for equipment) is going to be needed. The reason why VR is not achievable with this module is due 
    the fact that I (the creator of this module) do not have the require graphics card for this to appear properly. VR **DOES** require 
    a working discrete GPU for development on PC. However, you don't have to do this automatically. Also, tablet devices have bigger screens, so input
    will be harder without the right touch controls inplemented. Like I said, you don't have to contribute in this department if you don't want to.
3. Hosting
    For the module to have proper documentation, some knowledge of what is used for Roblox documenatation is required.
    However, I cannot find that particular solution. If anyone has the info needed to make this a reality, that would be appreciated.

## How should I contact Aero for contribution details?

The best way is either through Twitter or Discord. both use the same name seen here on Github.