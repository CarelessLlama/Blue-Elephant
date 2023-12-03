import createDebug from 'debug';

import { author, name, version } from '../../package.json';
import { Context, session } from 'telegraf';


const debug = createDebug('bot:about_command');

const countMessage = () => async (ctx: Context) => {
    const userSession = (ctx as any).session; // Cast ctx to 'any' type to access 'session' property
    const message = `You have sent ${userSession.counter} messages.`;
    debug(`${name} has sent ${userSession.counter} messages.`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { countMessage };
