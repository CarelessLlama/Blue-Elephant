import createDebug from 'debug';

import { author, name, version } from '../../package.json';


const debug = createDebug('bot:count_command');

const countMessage = () => async (ctx: any) => {
    try {
        ctx.session ??= { counter: 0 };
        const userSession = ctx.session; // Cast ctx to 'any' type to access 'session' property
        const message = `Hello ${ctx.from.first_name}! You have sent ${userSession.counter} messages to me.`;
        debug(`${name} has sent ${userSession.counter} messages.`);
        userSession.counter++;
        await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    } catch (error) {
        debug(error);
        await ctx.replyWithMarkdownV2(`Something went wrong. Please try again later.`, { parse_mode: 'Markdown' });
    }
};

export { countMessage };
