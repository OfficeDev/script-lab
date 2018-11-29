import { reactRunnerUrls, getCurrentEnv } from '../../src/environment';

window.location.href = reactRunnerUrls[getCurrentEnv()];
