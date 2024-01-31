import {
    makeSceneWithErrorHandling,
    executeCommandIfAny,
    goNextStep,
    waitForUserResponse,
    goToScene,
    askForProjectMembers,
    handleAddProjectMembersFactory,
    askForProjectName,
    handleEditProjectNameFactory,
    askForProjectDescription,
    handleEditProjectDescriptionFactory,
    saveProject,
    returnToPreviousMenuFactory,
    askAndHandleMenuFactory,
    handleProjectChoiceFactory,
} from '../../src/util/scene';
import { BotContext } from '../../src/BotContext';
import { MiddlewareFn, Markup } from 'telegraf';
import { Scenes } from 'telegraf';
import { Debugger } from 'debug';
import { author, name, version } from '../../package.json';

jest.mock('telegraf');
jest.mock('../../src/BotContext');

const message = `${name} ${version}\n${author}`;

/**
 * Mocks the following: ctx, next, debug, step
 * @type {BotContext} ctx
 * @type {jest.Mock} next
 * @type {Debugger} debug
 * @type {MiddlewareFn<BotContext>} step
 */
let ctx: BotContext;
let next: jest.Mock;
let debug: Debugger;
let step1: MiddlewareFn<BotContext>;
let step2: MiddlewareFn<BotContext>;

/**
 * Resets the mocks before each test
 */
beforeEach(() => {
    ctx = {
        wizard: {
            next: jest.fn(),
            step: jest.fn(),
            selectStep: jest.fn(),
        },
        scene: {
            enter: jest.fn(),
            reenter: jest.fn(),
            leave: jest.fn(),
            session: {}, // Add any necessary mock session data here
        },
        reply: jest.fn(),
    } as unknown as BotContext;
    step1 = jest.fn() as unknown as MiddlewareFn<BotContext>;
    step2 = jest.fn() as unknown as MiddlewareFn<BotContext>;
    debug = jest.fn() as unknown as Debugger;
});

/**
 * Test to verify if executeCommandIfAny function handles '/start' command correctly
 * by entering the 'mainMenu' scene.
 */
describe('makeSceneWithErrorHandling with correct arguments', () => {
    it('calls makeSceneWithErrorHandling with correct arguments', () => {
        const scene = makeSceneWithErrorHandling(
            'mainMenu',
            debug,
            step1,
            step2,
        );
        expect(scene).toBeInstanceOf(Scenes.WizardScene);
        expect(step1).toHaveBeenCalledTimes(0);
        expect(step2).toHaveBeenCalledTimes(0);
    });
});

/**
 * Test to verify if executeCommandIfAny function handles commands correctly
 */
describe('executeCommandIfAny with correct arguments', () => {
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

    it('calls executeCommandIfAny with correct arguments and /back command', async () => {
        await executeCommandIfAny('Back', 'mainMenu', ctx);
        expect(ctx.scene.enter).toHaveBeenCalledWith(
            'mainMenu',
            ctx.scene.session,
        );
    });
});

/**
 * Test to verify if goNextStep function handles scene changes correctly
 */
describe('goNextStep with correct arguments', () => {
    it('calls goNextStep with correct arguments', async () => {
        await goNextStep(ctx, next);
        expect(ctx.wizard.step).toHaveBeenCalledWith(ctx, next);
    });
});

/**
 * Test to verify if waitForUserResponse function handles scene changes correctly
 */
describe('waitForUserResponse with correct arguments', () => {
    it('calls waitForUserResponse with correct arguments', async () => {
        await waitForUserResponse(ctx);
        expect(ctx.wizard.next).toHaveBeenCalled();
    });
});

/**
 * Test to verify if goToScene function handles scene changes correctly
 */
describe('goToScene with correct arguments', () => {
    it('calls goToScene with correct arguments', async () => {
        await goToScene('mainMenu', ctx);
        expect(ctx.scene.enter).toHaveBeenCalledWith(
            'mainMenu',
            ctx.scene.session,
        );
    });
});

/**
 * Test to verify if askForProjectMembers function handles scene changes correctly
 */
describe('askForProjectMembers with correct arguments', () => {
    it('calls askForProjectMembers with correct arguments', async () => {
        await askForProjectMembers(ctx);
        expect(ctx.reply).toHaveBeenCalledWith(
            `Please enter the project members' names, delimited by commas. To cancel, type "Back".`,
            Markup.removeKeyboard(),
        );
        expect(ctx.wizard.next).toHaveBeenCalled();
    });
});

/**
 * Test to verify if handleAddProjectMembersFactory function handles scene changes correctly
 */
describe('handleAddProjectMembersFactory with correct arguments', () => {
    it('calls handleAddProjectMembersFactory with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});

/**
 * Test to verify if askForProjectName function handles scene changes correctly
 */
describe('askForProjectName with correct arguments', () => {
    it('calls askForProjectName with correct arguments', async () => {
        await askForProjectName(ctx);
        expect(ctx.reply).toHaveBeenCalledWith(
            `Please enter your new project name. To cancel, type "Back".`,
            Markup.removeKeyboard(),
        );
        expect(ctx.wizard.next).toHaveBeenCalled();
    });
});

/**
 * Test to verify if handleEditProjectNameFactory function handles scene changes correctly
 */
describe('handleEditProjectNameFactory with correct arguments', () => {
    it('calls handleEditProjectNameFactory with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});

/**
 * Test to verify if askForProjectDescription function handles scene changes correctly
 */
describe('askForProjectDescription with correct arguments', () => {
    it('calls askForProjectDescription with correct arguments', async () => {
        await askForProjectDescription(ctx);
        expect(ctx.reply).toHaveBeenCalledWith(
            `Please enter your new project description. To cancel, type "Back".`,
            Markup.removeKeyboard(),
        );
        expect(ctx.wizard.next).toHaveBeenCalled();
    });
});

/**
 * Test to verify if handleEditProjectDescriptionFactory function handles scene changes correctly
 */
describe('handleEditProjectDescriptionFactory with correct arguments', () => {
    it('calls handleEditProjectDescriptionFactory with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});

/**
 * Test to verify if saveProject function handles scene changes correctly
 */
describe('saveProject with correct arguments', () => {
    it('calls saveProject with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});

/**
 * Test to verify if returnToPreviousMenuFactory function handles scene changes correctly
 */
describe('returnToPreviousMenuFactory with correct arguments', () => {
    it('calls returnToPreviousMenuFactory with correct arguments', async () => {
        await returnToPreviousMenuFactory('mainMenu')(ctx);
        expect(ctx.scene.enter).toHaveBeenCalledWith(
            'mainMenu',
            ctx.scene.session,
        );
    });
});

/**
 * Test to verify if askAndHandleMenuFactory function handles scene changes correctly
 */
describe('askAndHandleMenuFactory with correct arguments', () => {
    it('calls askAndHandleMenuFactory with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});

/**
 * Test to verify if handleProjectChoiceFactory function handles scene changes correctly
 */
describe('handleProjectChoiceFactory with correct arguments', () => {
    it('calls handleProjectChoiceFactory with correct arguments', async () => {
        // TODO: Add test (requires mocking)
    });
});
