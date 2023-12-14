import createDebug from 'debug';

import { name } from '../../package.json';

const debug = createDebug('bot:count_command');

/**
 * Counts the number of messages sent to the bot.
 * @returns A middleware function that handles the counting of messages.
 * This function serves the purpose of testing how the Telegraf Session object is being used.
 */
const countMessage = () => async (ctx: any) => {
    try {
        ctx.session ??= { counter: 1 };
        const userSession = ctx.session; // Cast ctx to 'any' type to access 'session' property
        const message = `Hello ${ctx.from.first_name}! You have sent ${userSession.counter} messages to me.`;
        debug(`${name} has sent ${userSession.counter} messages.`);
        userSession.counter++;
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(
            `Something went wrong. Please try again later.`,
            { parse_mode: 'Markdown' },
        );
    }
};

export { countMessage };
