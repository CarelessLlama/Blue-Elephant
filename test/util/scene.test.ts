import {
    makeSceneWithErrorHandling,
    executeCommandIfAny,
    goToScene,
} from '../../src/util/scene';
import { BotContext } from '../../src/BotContext';
import { MiddlewareFn } from 'telegraf';
import { Scenes } from 'telegraf';
import { Debugger } from 'debug';
import { author, name, version } from '../../package.json';

jest.mock('telegraf');
jest.mock('../../src/BotContext');

const message = `${name} ${version}\n${author}`;

describe('scene.ts', () => {
    let ctx: BotContext;
    let next: jest.Mock;
    let debug: Debugger;
    let step: MiddlewareFn<BotContext>;

    beforeEach(() => {
        ctx = {
            scene: {
                enter: jest.fn(),
                reenter: jest.fn(),
                leave: jest.fn(),
                session: {}, // Add any necessary mock session data here
            },
            reply: jest.fn(),
        } as unknown as BotContext;
        next = jest.fn();
        debug = jest.fn() as unknown as Debugger;
        step = jest.fn();
    });

    it('calls makeSceneWithErrorHandling with correct arguments', () => {
        const scene = makeSceneWithErrorHandling('sceneId', debug, step);
        expect(scene).toBeInstanceOf(Scenes.WizardScene);
        expect(step).toHaveBeenCalledTimes(0);
    });

    it('calls executeCommandIfAny with correct arguments and no commands', async () => {
        const result = await executeCommandIfAny(
            'Some Random Text',
            'backLocation',
            ctx,
        );
        expect(result).toBeUndefined();
        expect(ctx.scene.reenter).toHaveBeenCalledTimes(0);
        expect(ctx.scene.leave).toHaveBeenCalledTimes(0);
        expect(ctx.reply).toHaveBeenCalledTimes(0);
    });

    it('calls executeCommandIfAny with correct arguments and /start command', async () => {
        await executeCommandIfAny('/start', 'backLocation', ctx);
        expect(ctx.scene.enter).toHaveBeenCalledWith(
            'mainMenu',
            ctx.scene.session,
        );
    });

    it('calls executeCommandIfAny with correct arguments and /about command', async () => {
        await executeCommandIfAny('/about', 'backLocation', ctx);
        expect(ctx.reply).toHaveBeenCalledWith(message);
        expect(ctx.scene.reenter).toHaveBeenCalled();
    });

    it('calls executeCommandIfAny with correct arguments and /exit command', async () => {
        await executeCommandIfAny('/exit', 'backLocation', ctx);
        expect(ctx.reply).toHaveBeenCalledWith('Bye!');
        expect(ctx.scene.leave).toHaveBeenCalled();
    });
});
