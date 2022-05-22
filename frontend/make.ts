import * as fs from 'fs';
import * as path from 'path';

const printHelpAndExit = (message?: string, exitCode?: number) => {
  console.log(message);
  console.log('Usage: make <path/to/ComponentName> [-c | --children | --with-children]');
  process.exit(exitCode ?? 1);
};

const appendTSX = (filePath: string) => filePath.match(/\.tsx?$/) ? filePath : `${filePath}.tsx`;

const getComponentContent = (componentName: string, withChildren: boolean) => {
  const additionalImports = withChildren
    ? `, ParentProps, children as resolveChildren`
    : '';
  const componentBaseProps = `${componentName}Props`;
  const componentType = withChildren
    ? `Component<ParentProps<${componentBaseProps}>>`
    : `Component<${componentBaseProps}>`;
  const childrenResolve = withChildren
    ? `const children = resolveChildren(() => props.children);\n\n  `
    : '';
  const defaultContent = withChildren
    ? `\n    {children()}\n  `
    : ``;

  return `import { Component${additionalImports} } from 'solid-js';

export interface ${componentBaseProps} {

}

const ${componentName}: ${componentType} = (props) => {
  ${childrenResolve}return <>${defaultContent}</>;
};

export default ${componentName};
`;
};

const argCount = process.argv.length;

if (![3, 4].includes(argCount))
  printHelpAndExit();

const rawPath = process.argv[2] || '';

if (!rawPath)
  printHelpAndExit('Invalid component path. Please provide a valid path. {.tsx} extension is optional.', 2);

const componentPath = appendTSX(rawPath);

const childrenFlag: string | undefined | null = process.argv[3];
const childrenFlagOptions = ['-c', '--children', '--with-children'];

const withChildren: boolean = !!childrenFlag && childrenFlagOptions.includes(childrenFlag);

const parsedPath = path.parse(componentPath);

const parsedArguments = {
  componentPath,
  parsedPath,
  withChildren,
};

if (fs.existsSync(componentPath))
  printHelpAndExit('Component already exists', 3);

fs.mkdirSync(parsedPath.dir, { recursive: true });

const content = getComponentContent(parsedPath.name, withChildren);

fs.writeFileSync(componentPath, content);

const result = {
  arguments: parsedArguments,
  result: content,
};

console.log(result);

export default result;
