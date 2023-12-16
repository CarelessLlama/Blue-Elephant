import { Debugger } from 'debug';
import { BotContext } from '../BotContext';
import { InvalidInputTypeError, UnknownError } from '../exceptions';
import { Project } from '../models/Project';

// utility functions for retrieving data from BotContext
function getResponse(ctx: BotContext, err: Error): string {
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
    if (!ctx.message.text) {
        throw err;
    }
    return ctx.message.text;
}
function getProject(ctx: BotContext): Project {
    if (!ctx.scene.session.project) {
        throw new UnknownError(
            'Project could not be found. This should not be happening.',
        );
    }
    return ctx.scene.session.project;
}

async function handleError(
    ctx: BotContext,
    error: Error,
    debug: Debugger,
): Promise<void> {
    const errorMessage = error.message;
    debug(errorMessage);
    await ctx.reply(errorMessage);
}

export { getResponse, getProject, handleError };
