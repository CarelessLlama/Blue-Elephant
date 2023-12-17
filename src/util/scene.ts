import { MiddlewareFn, Scenes } from 'telegraf';
import { BotContext } from '../BotContext';
import { getProject, getResponse, handleError } from './botContext';
import { Debugger } from 'debug';
import { getProjectMembersFromString, isBackCommand } from './userInput';
import { updateProjectInDb } from '../db/functions';

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

// Scene factories
export const askForProjectMembers = async (ctx: BotContext) => {
    await ctx.reply(
        `Please enter the project members' names, delimited by commas. To cancel, type "Back".`,
    );
    return waitForUserResponse(ctx);
};

export const handleAddProjectMembersFactory =
    (debug: Debugger, backLocation: string) =>
    async (ctx: BotContext, next: () => Promise<void>) => {
        const text = getResponse(ctx);
        if (isBackCommand(text)) {
            debug('User indicated to go back');
            return ctx.scene.enter(backLocation, ctx.scene.session);
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
    );
    return waitForUserResponse(ctx);
};

export const handleEditProjectNameFactory =
    (debug: Debugger, backLocation: string) =>
    async (ctx: BotContext, next: () => Promise<void>) => {
        const text = getResponse(ctx);
        if (isBackCommand(text)) {
            debug('User selected "Back"');
            return ctx.scene.enter(backLocation, ctx.scene.session);
        }
        const project = getProject(ctx);
        project.setName(text);
        return goNextStep(ctx, next);
    };

export const askForProjectDescription = async (ctx: BotContext) => {
    await ctx.reply(
        `Please enter your new project description. To cancel, type "Back".`,
    );
    return waitForUserResponse(ctx);
};

export const handleEditProjectDescriptionFactory =
    (debug: Debugger, backLocation: string) =>
    async (ctx: BotContext, step: () => Promise<void>) => {
        const text = getResponse(ctx);
        if (isBackCommand(text)) {
            debug('User selected "Back"');
            return ctx.scene.enter(backLocation, ctx.scene.session);
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
        return ctx.scene.enter(backLocation, ctx.scene.session);
    };
