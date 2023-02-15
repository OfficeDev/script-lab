export const LIBRARIES_FILE_NAME = 'libraries.txt';
export const SCRIPT_FILE_NAME = 'index.ts';

export function findScript(solution: ISolution): IFile | null {
  return helper(solution, SCRIPT_FILE_NAME);
}

export function findLibraries(solution: ISolution): IFile | null {
  return helper(solution, LIBRARIES_FILE_NAME);
}

/// ////////////////////////////////////

function helper(solution: ISolution, filename: string) {
  return solution.files.find(file => file.name === filename) || null;
}
