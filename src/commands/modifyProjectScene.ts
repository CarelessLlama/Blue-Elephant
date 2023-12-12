import createDebug from 'debug';

import { Scenes, Markup } from 'telegraf';

import { UnknownError, InvalidInputTypeError } from '../exceptions';

import { BotContext } from '../BotContext';
import { Project } from '../models/Project';

const debug = createDebug('bot:generate_existing_projects_command');

interface ProjectContainer {
    proj: Project;
}

const modifyProject = async (ctx: BotContext) => {
    try {
        debug(`Entering modifyProject scene.`);
        const state = ctx.wizard.state as ProjectContainer;
        console.log(state.proj);
        await ctx.reply(
            `Project retrieved. What do you want to do?`,
            Markup.keyboard([
                ['View Project Details', 'Edit Project'],
                ['Delete Project', 'Back'],
            ]).resize(),
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const handleModifyProjectOption = async (ctx: BotContext) => {
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
        if (ctx.message?.text === 'View Project Details') {
            debug('User selected "View Project Details"');
            let out = `Project Details are as follows:\n`;
            out += `Project Name: ${ctx.scene.session.project.getName()}\n`;
            out += `Project Description: ${ctx.scene.session.project.getDescription()}\n`;
            out += `Project Members: ${ctx.scene.session.project.getPersons()}\n`;
            await ctx.reply(out);
            return ctx.scene.reenter();
        } else if (ctx.message?.text === 'Edit Project') {
            debug('User selected "Edit Project"');
            // to do: edit project scene
            return ctx.scene.enter('editProject', Markup.removeKeyboard());
        } else if (ctx.message?.text === 'Delete Project') {
            debug('User selected "Delete Project"');
            console.log(ctx.scene.session.project);
            return ctx.scene.enter('deleteProject', Markup.removeKeyboard());
        } else if (ctx.message?.text === 'Back') {
            debug('User selected "Back"');
            return ctx.scene.enter('existingProjects', Markup.removeKeyboard());
        } else {
            await ctx.reply(
                'Invalid option. Please select a valid option from the keyboard.',
            );
            return ctx.wizard.back();
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const modifyProjectScene = new Scenes.WizardScene<BotContext>(
    'modifyProject',
    modifyProject,
    handleModifyProjectOption,
);

export { modifyProjectScene };
