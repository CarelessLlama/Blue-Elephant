import { Markup, MiddlewareFn, Scenes } from 'telegraf';
import { BotContext } from '../BotContext';
import { getProject, getResponse, handleError } from './botContext';
import { Debugger } from 'debug';
import { getProjectMembersFromString, isBackCommand } from './userInput';
import { updateProjectInDb } from '../db/functions';
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
        if (isBackCommand(text)) {
            return goToScene(backLocation, ctx);
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
        if (isBackCommand(text)) {
            return goToScene(backLocation, ctx);
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
        if (isBackCommand(text)) {
            return goToScene(backLocation, ctx);
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
    previousMenu: string | undefined,
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
        if (isBackCommand(text) && previousMenu) {
            debug('User selected "Back"');
            return goToScene(previousMenu, ctx);
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
