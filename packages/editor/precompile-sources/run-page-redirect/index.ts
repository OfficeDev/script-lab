import { runnerUrls, getCurrentEnv } from '../../src/environment';

window.location.href = runnerUrls[getCurrentEnv()];
