import { MiddlewareFn, Scenes } from 'telegraf';
import { BotContext } from '../BotContext';
import { handleError } from './botContext';
import { Debugger } from 'debug';

function makeSceneWithErrorHandling(
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
                handleError(ctx, error as Error, debug);
                return ctx.scene.reenter();
            }
        };
    }
    return new Scenes.WizardScene<BotContext>(
        id,
        ...steps.map(addErrorHandlingToStep),
    );
}

export { makeSceneWithErrorHandling };
