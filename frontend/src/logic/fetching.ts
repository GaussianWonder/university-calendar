function isErrorResponse(response: Response): boolean {
  return !response.ok || response.status >= 400 && response.status <= 599;
} 

function shortErrorMessage(response: Response): string {
  return `${response.statusText} (${response.status})`;
}

function throwResponseError(response: Response): never {
  throw new Error(shortErrorMessage(response));
}

function throwIfError(response: Response): void {
  if (isErrorResponse(response)) {
    throwResponseError(response);
  }
}

function containsMandatoryKeys(obj: any, keys: string[] = []): [boolean, string[]] {
  const missingKeys = keys.filter(key => !(key in obj));
  if (missingKeys.length > 0)
    return [false, missingKeys];
  return [true, []];
}

export type ResolvedRespone<T> = (response: Response) => Promise<T>;

export function expectJson<T>(mandatoryKeys: string[] = []): ResolvedRespone<T> {
  return async (response: Response) => {
    throwIfError(response);

    const data: T = await response.json();
    const [valid, missingKeys] = containsMandatoryKeys(data, mandatoryKeys);
    if (!valid)
      throw new Error(`Missing keys in input: ${missingKeys.join(', ')}`);

    return data;
  };
}

export function expectJsonArray<T>(mandatoryKeys: string[] = []): ResolvedRespone<T[]> {
  return async (response: Response) => {
    throwIfError(response);

    const data: T[] = await response.json();
    if (!Array.isArray(data))
      throw new Error(`Expected an array, found ${typeof data}`);

    data.forEach((item) => {
      const [valid, missingKeys] = containsMandatoryKeys(item, mandatoryKeys);

      if (!valid)
        throw new Error(`Missing keys in input: ${missingKeys.join(', ')}`);
    });

    return data;
  };
}
