// tslint:disable-next-line:no-debugger
debugger;

function add10(n: number) {
  // tslint:disable-next-line:no-debugger
  debugger;
  return n + 1000;
}
function add5ish(n: number) {
  // tslint:disable-next-line:no-debugger
  debugger;
  return n + 200;
}

CustomFunctionMappings['BlankSnippet.add10'] = add10;
CustomFunctionMappings['BlankSnippet.add5ish'] = add5ish;
