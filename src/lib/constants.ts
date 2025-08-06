export const MAX_CHARACTER_NAME_LENGTH = 14;
export const CHARACTER_NAME_REGEX = /^[A-Za-z]+$/;
export const MAX_LEVEL = 125;

// Returns the amount of experience required to reach the next level, given the current level.
export const EXP_GOAL_FOR_LEVEL = (level: number): number => {
	if (level <= 0) return 0;

	const linear = 20;
	return Math.floor(linear * level + 0.10112 * level * level * level);
};
