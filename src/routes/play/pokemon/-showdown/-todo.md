<!-- no agent should ever write in this file, only humans.

this file serves as non-structured notes for the module,
prefer colocated jsdocs in most cases, only use this for
meta-stuff, planning, notes, decisions, or anything that
you'd want to explicitly NOT put inline with any code.
-->

# @bdsqqq @ 2026-03-22T23:42

## intent

is twofold, want to:

1. make a showdown! client on my site, that talks to the REAL pokemon showdown servers.
2. make a showdown! bot that auto-battles.

# @bdsqqq @ 2026-03-23T19:25

to communicate with any instance of pokemon showdown (or even for separate pokemon calcs, like a self-contained game complitely in my site), we need to speak the showdown protocol, as outlined in [https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md]

the showdown battle simulator itself is complitelly inside of [https://github.com/smogon/pokemon-showdown/blob/master/sim/battle.ts],

- [ ] in their README, they explain that it is runnable in Node, but not in browser... I'm not sure why tho, would be good to have some way of running it in a worker in a client.need to investigate and decide if I'll need to make a minimum reimplementation of the system(I don't want to, too many edges), or something else.
