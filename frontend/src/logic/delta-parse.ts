import Delta from "quill-delta";
import { HasDeltaContent, HasDeltaDescription } from "../types/utility/delta-content";

export function parseDeltaDescription<T extends HasDeltaDescription>(containsDelta: T): T {
  const unparsedDelta = containsDelta.description as unknown;

  switch (typeof unparsedDelta) {
    case 'string':
      const withOps = JSON.parse(unparsedDelta) as Delta;
      return {
        ...containsDelta,
        description: new Delta(withOps.ops),
      };
    case 'object':
      return {
        ...containsDelta,
        description: new Delta((unparsedDelta as any)?.ops),
      };
  }
  console.info('No delta to parse!');
  return containsDelta;
}

export function parseDeltaContent<T extends HasDeltaContent>(containsDelta: T): T {
  const unparsedDelta = containsDelta.content as unknown;

  switch (typeof unparsedDelta) {
    case 'string':
      const withOps = JSON.parse(unparsedDelta) as Delta;
      return {
        ...containsDelta,
        content: new Delta(withOps.ops),
      };
    case 'object':
      return {
        ...containsDelta,
        content: new Delta((unparsedDelta as any)?.ops),
      };
  }
  console.info('No delta to parse!');
  return containsDelta;
}
