import { createStore, combineReducers } from "redux";

import selection from "./selection";
import solutions from "./solutions";
import files from "./files";
import users from "./users";

import { normalize } from "normalizr";
import sampleSolution from "../sampleData";
import { solution } from "../storage/schema";

const { entities } = normalize(sampleSolution, solution);

const reducer = combineReducers({ selection, solutions, files, users });

export default createStore(reducer, entities);
