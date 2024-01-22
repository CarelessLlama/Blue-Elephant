import { Markup, MiddlewareFn, Scenes } from 'telegraf';
import { BotContext } from '../BotContext';
import { author, name, version } from '../../package.json';
import {
    getMapFromSession,
    getProject,
    getResponse,
    handleError,
    storeProjectInSession,
} from './botContext';
import { Debugger } from 'debug';
import {
    getProjectMembersFromString,
    isBackCommand,
    isStartCommand,
    isAboutCommand,
    isExitCommand,
} from './userInput';
import { loadProjectFromDb, updateProjectInDb } from '../db/functions';
import { InvalidTextError } from '../exceptions';

export function makeSceneWithErrorHandling(
    id: string,
    debug: Debugger,
    ...steps: MiddlewareFn<BotContext>[]
) {
    function addErrorHandlingToStep(
        step: MiddlewareFn<BotContext>,
    ): MiddlewareFn<BotContext> {
        return async (ctx: BotContext, next: () => Promise<void>) => {
            try {
                return await step(ctx, next);
            } catch (error) {
                await handleError(ctx, error as Error, debug);
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
        };
    }
    return new Scenes.WizardScene<BotContext>(
        id,
        ...steps.map(addErrorHandlingToStep),
    );
}

function executeCommandIfAny(
    text: string,
    backLocation: string,
    ctx: BotContext,
): Promise<void> | Promise<unknown> | void {
    if (isBackCommand(text)) {
        return goToScene(backLocation, ctx);
    }
    if (isStartCommand(text)) {
        return goToScene('mainMenu', ctx);
    }
    if (isAboutCommand(text)) {
        const message = `${name} ${version}\n${author}`;
        ctx.reply(message);
        ctx.scene.reenter();
        // BUG: reentering the scene causes the bot to reply 'Invalid option. Please select a valid option from the keyboard.'
    }
    if (isExitCommand(text)) {
        ctx.reply('Bye!');
        return ctx.scene.leave();
    }
    return;
}

// Scene abstractions
export const goNextStep = async (
    ctx: BotContext,
    next: () => Promise<void>,
) => {
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
        return ctx.wizard.step(ctx, next);
    }
};
export const waitForUserResponse = async (ctx: BotContext) => {
    return ctx.wizard.next();
};

export const goToScene = (sceneId: string, ctx: BotContext) => {
    return ctx.scene.enter(sceneId, ctx.scene.session);
};

// Scene factories
export const askForProjectMembers = async (ctx: BotContext) => {
    await ctx.reply(
        `Please enter the project members' names, delimited by commas. To cancel, type "Back".`,
        Markup.removeKeyboard(),
    );
    return waitForUserResponse(ctx);
};

export const handleAddProjectMembersFactory =
    (debug: Debugger, backLocation: string) =>
    async (ctx: BotContext, next: () => Promise<void>) => {
        const text = getResponse(ctx);
        const command = executeCommandIfAny(text, backLocation, ctx);
        if (command) {
            return command;
        }
        const personArr = getProjectMembersFromString(text);
        debug(`Project members' inputs: ${text}`);
        const project = getProject(ctx);
        project.addPeople(personArr);
        return goNextStep(ctx, next);
    };

export const askForProjectName = async (ctx: BotContext) => {
    await ctx.reply(
        `Please enter your new project name. To cancel, type "Back".`,
        Markup.removeKeyboard(),
    );
    return waitForUserResponse(ctx);
};

export const handleEditProjectNameFactory =
    (backLocation: string) =>
    async (ctx: BotContext, next: () => Promise<void>) => {
        const text = getResponse(ctx);
        const command = executeCommandIfAny(text, backLocation, ctx);
        if (command) {
            return command;
        }
        const project = getProject(ctx);
        project.setName(text);
        return goNextStep(ctx, next);
    };

export const askForProjectDescription = async (ctx: BotContext) => {
    await ctx.reply(
        `Please enter your new project description. To cancel, type "Back".`,
        Markup.removeKeyboard(),
    );
    return waitForUserResponse(ctx);
};

export const handleEditProjectDescriptionFactory =
    (debug: Debugger, backLocation: string) =>
    async (ctx: BotContext, step: () => Promise<void>) => {
        const text = getResponse(ctx);
        const command = executeCommandIfAny(text, backLocation, ctx);
        if (command) {
            return command;
        }
        const project = getProject(ctx);
        project.setDescription(text);
        return goNextStep(ctx, step);
    };

export const saveProject = async (
    ctx: BotContext,
    step: () => Promise<void>,
) => {
    const project = getProject(ctx);
    updateProjectInDb(project);
    await ctx.reply(`Project saved.`);
    return goNextStep(ctx, step);
};

export const returnToPreviousMenuFactory =
    (backLocation: string) => async (ctx: BotContext) => {
        return goToScene(backLocation, ctx);
    };

export const askAndHandleMenuFactory = (
    debug: Debugger,
    previousMenu: string,
    question: string,
    map: Map<string, MiddlewareFn<BotContext>>,
): [MiddlewareFn<BotContext>, MiddlewareFn<BotContext>] => {
    const askSelectFromMenu = async (ctx: BotContext) => {
        const choices = [...map.keys()];
        if (previousMenu) {
            choices.push('Back');
        }
        await ctx.reply(question, Markup.keyboard(choices).resize());
        return waitForUserResponse(ctx);
    };
    const handleSelectFromMenu = async (
        ctx: BotContext,
        next: () => Promise<void>,
    ) => {
        const text = getResponse(ctx);
        const command = executeCommandIfAny(text, previousMenu, ctx);
        if (command) {
            return command;
        }
        const scene = map.get(text);
        if (!scene) {
            throw new InvalidTextError(
                `Invalid option. Please select a valid option from the keyboard.`,
            );
        }
        debug(`User selected "${text}"`);
        return scene(ctx, next);
    };
    return [askSelectFromMenu, handleSelectFromMenu];
};

export const handleProjectChoiceFactory =
    (debug: Debugger, backLocation: string) => async (ctx: BotContext) => {
        const text = getResponse(ctx);
        const command = executeCommandIfAny(text, backLocation, ctx);
        if (command) {
            return command;
        }
        const projectMap = getMapFromSession(ctx);
        const projectId = projectMap.get(text);
        if (projectId) {
            debug(`User selected to view ${text}`);
            const proj = await loadProjectFromDb(projectId);
            storeProjectInSession(ctx, proj);
            await ctx.reply(
                `Loading existing project.`,
                Markup.removeKeyboard(),
            );
            return goToScene('manageProject', ctx);
        } else {
            throw new InvalidTextError(
                'Invalid option. Please select a valid option from the keyboard.',
            );
        }
    };
