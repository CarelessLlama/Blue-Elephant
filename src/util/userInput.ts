import { BotContext } from '../BotContext';
import {
    InvalidInputTypeError,
    UnknownError,
    InvalidTextError,
} from '../exceptions';

/**
 * Parses a string of people into an array of people
 * @param peopleList - The string of people
 * @returns An array of people
 */
export const parsePeopleListString = (peopleList: string): string[] => {
    const peopleArr = peopleList.split(',').map((person) => person.trim());
    return peopleArr;
};

/**
 * Checks if a string is a valid project name.
 * @param text - The text to check

 */
export const validateProjectName = (text: string) => {
    if (text.length < 3 || text.startsWith('/')) {
        throw new InvalidTextError(
            "Please enter a valid project name. A project name needs to be at least 3 characters long and cannot start with '/'.",
        );
    }
};

/**
 * Checks if a string is a valid project description.
 * @param text - The text to check
 */
export const validateProjectDescription = (text: string) => {
    if (text.length < 3) {
        throw new InvalidTextError(
            'Please enter a valid project description. A project description needs to be at least 3 characters long.',
        );
    }
};

/**
 * Checks if a string is a valid project members' list.
 * @param text - The text to check
 * @returns An array of people
 */
export const getProjectMembersFromString = (text: string) => {
    // TODO
    const memberArr = text.split(',').map((person) => person.trim());

    memberArr.map((person) => {
        if (person.length > 30) {
            throw new InvalidTextError(
                'Please enter a valid project member. A project member name cannot be longer than 50 characters.',
            );
        }
    });
    return memberArr;
};

/**
 * Checks if user input is a valid string in general.
 * @param ctx - The context of the bot
 * @throws UnknownError if context provided is not of correct format
 * @throws InvalidInputTypeError if the input type is invalid
 */
export const getTextFromTextMessages = (ctx: BotContext) => {
    if (!ctx.from || !ctx.message) {
        throw new UnknownError(
            'An unknown error occurred. Please try again later.',
        );
    }

    if (!('text' in ctx.message)) {
        throw new InvalidInputTypeError(
            'Invalid input type. Please enter a text message.',
        );
    }

    const text = ctx.message?.text;
    if (!text) {
        throw new InvalidTextError('Please enter a valid project description.');
    }

    return text;
};
