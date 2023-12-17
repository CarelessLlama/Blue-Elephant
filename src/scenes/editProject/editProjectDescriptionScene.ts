import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askForProjectDescription,
    goNextStep,
    handleEditProjectDescriptionFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:edit_project_description_command');
const previousMenu = 'editProject';

const editProjectDescription = async (
    ctx: BotContext,
    next: () => Promise<void>,
) => {
    debug('Entered editProjectDescription scene.');
    updateSessionDataBetweenScenes(ctx);
    return goNextStep(ctx, next);
};

const editProjectDescriptionScene = makeSceneWithErrorHandling(
    'editProjectDescription',
    debug,
    editProjectDescription,
    askForProjectDescription,
    handleEditProjectDescriptionFactory(debug, previousMenu),
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { editProjectDescriptionScene };
