import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import {
    InvalidInputTypeError,
    InvalidTextError,
    UnknownError,
} from '../exceptions';

import { BotContext } from '../BotContext';

/**
 * Debug module for 'bot:generate_existing_projects_command'.
 */
const debug = createDebug('bot:generate_existing_projects_command');

/**
 * Map of menu options to scene names.
 */
const menuOptionsToScenesMap = new Map<string, string>([
    ['Create New Project', 'addProject'],
    ['View Existing Project(s)', 'existingProjects'],
]);

/**
 * Array of menu options.
 */
const menuOptions = Array.from(menuOptionsToScenesMap.keys());

/**
 * Handles the selection of a main menu option.
 * @param ctx - The bot context.
 * @throws {UnknownError} If ctx.message is undefined.
 * @throws {InvalidInputTypeError} If ctx.message does not contain a 'text' property.
 */
const handleMainMenuSelection = async (ctx: BotContext) => {
    if (!ctx.message) {
        throw new UnknownError(
            'An unknown error occurred. Please try again later.',
        );
    }

    if (!('text' in ctx.message)) {
        throw new InvalidInputTypeError(
            'Invalid input type. Please enter a text message.',
        );
    }

    const sceneName = menuOptionsToScenesMap.get(ctx.message?.text);
    if (sceneName) {
        debug(`User selected "${ctx.message?.text}"`);
        return ctx.scene.enter(sceneName, Markup.removeKeyboard());
    }

    throw new InvalidTextError(
        'Invalid option. Please select a valid option from the keyboard.',
    );
};

/**
 * Asks the user to select a main menu option.
 * @param ctx - The bot context.
 */
const askForMainMenuOption = async (ctx: BotContext) => {
    debug(`Entering Main Menu scene.`);
    await ctx.reply(
        `Please select what you want to do.`,
        Markup.keyboard([menuOptions]).resize(),
    );
    return ctx.wizard.next();
};

/**
 * Handles the selection of a main menu option.
 * @param ctx - The bot context.
 * @throws {UnknownError} If ctx.message is undefined.
 * @throws {InvalidInputTypeError} If ctx.message does not contain a 'text' property.
 * @throws {InvalidTextError} If ctx.message.text is not a valid option.
 */
const handleMainMenuOption = async (ctx: BotContext) => {
    try {
        await handleMainMenuSelection(ctx);
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

/**
 * The main menu scene.
 */
const viewMainMenuScene = new Scenes.WizardScene<BotContext>(
    'mainMenu',
    askForMainMenuOption,
    handleMainMenuOption,
);

export { viewMainMenuScene };
