import type { JobDef } from '../types';

export const killSomeGuy: JobDef = {
	id: 'job.kill_some_guy',
	name: 'Kill Some Guy',
	description: "yo we've got some guy for you to kill",
	minLevel: 1
};

export const killSomeOtherGuy: JobDef = {
	id: 'job.kill_some_other_guy',
	name: 'Kill Some Other Guy',
	description: "yo we've got some other guy for you to kill",
	minLevel: 1
};
