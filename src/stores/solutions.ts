import { createAction, handleActions } from "redux-actions";
import { getInitialSolutions } from "../storage";

// Types
interface ISolution {
  id: string;
  name: string;
  date_created: number;
  date_last_modified: number;
  files: string[];
}

// Actions
export const addSolution = createAction("SOLUTION_ADD");
export const deleteSolution = createAction("SOLUTION_DELETE");

// State
const initialState = getInitialSolutions();

// Reducers
export default handleActions(
  {
    SOLUTION_ADD: (state, action) => [...state, action.payload],
    SOLUTION_DELETE: (state, action) => state.filter(sol => sol.id !== action.payload),
  },
  initialState,
);

// Selectors
export const getSolutions = ({ solutions }) => Object.values(solutions);
export const getSolutionsMap = ({ solutions }) => solutions;
