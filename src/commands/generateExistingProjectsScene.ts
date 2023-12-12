import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { getProjects, loadProject } from '../../db/functions';

import { Project } from './../models/Project';

import { BotContext } from '../BotContext';

const debug = createDebug('bot:existing_projects_command');

const viewExistingProjectNames = async (ctx: BotContext) => {
    try {
        if (!ctx.from) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }
        debug(`Entering viewExistingProjects scene.`);
        const userProjectMap = await getProjects(ctx.from.id);
        ctx.scene.session.projectMap = userProjectMap;
        const userProjectList = [...userProjectMap.keys()].map((proj) =>
            proj.toString(),
        );
        await ctx.reply(
            `Please choose an existing project that you want to view.`,
            Markup.keyboard([...userProjectList, 'Back']).resize(),
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const handleExistingProjects = async (ctx: BotContext) => {
    try {
        if (!ctx.message || !ctx.from) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }

        if (!('text' in ctx.message)) {
            throw new InvalidInputTypeError(
                'Invalid input type. Please enter a text message.',
            );
        }
        const text = ctx.message.text;
        // search for existing projects based on project names in DB
        const userProjectList = [...ctx.scene.session.projectMap.keys()].map(
            (proj) => proj.toString(),
        );
        if (userProjectList.includes(text)) {
            debug(`User selected to view ${text}`);
            const projId = ctx.scene.session.projectMap.get(text);
            let proj = await loadProject(new String(projId).toString());
            ctx.scene.session.project = proj;
            await ctx.reply(
                `Loading existing project.`,
                Markup.removeKeyboard(),
            );
            console.log(ctx.scene.session.project);
            // TODO: Context is not being passed to the next scene. Need to fix this.
            return ctx.scene.enter('modifyProject', Markup.removeKeyboard());
        } else if (text === 'Back') {
            return ctx.scene.enter('mainMenu');
        } else {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.scene.reenter();
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const generateExistingProjectsScene = new Scenes.WizardScene<BotContext>(
    'existingProjects',
    viewExistingProjectNames,
    handleExistingProjects,
);

export { generateExistingProjectsScene };
