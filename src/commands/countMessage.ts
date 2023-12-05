import createDebug from 'debug';

import { author, name, version } from '../../package.json';
import { Context, session } from 'telegraf';


const debug = createDebug('bot:count_command');

const countMessage = () => async (ctx: any) => {
    try {
        const userSession = ctx.session; // Cast ctx to 'any' type to access 'session' property
        const message = `You have sent ${userSession.counter} messages.`;
        debug(`${name} has sent ${userSession.counter} messages.`);
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(`Something went wrong. Please try again later.`, { parse_mode: 'Markdown' });
    }
};

export { countMessage };
