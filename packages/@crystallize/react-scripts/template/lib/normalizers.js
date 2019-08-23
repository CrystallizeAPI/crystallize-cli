import changeCase from 'change-case';

// Converts content_fields into an object with easy accessible field props
export const normalizeComponents = obj => {
  if (!obj) {
    return obj;
  }

  const normalized = {};

  if (Array.isArray(obj)) {
    obj.forEach(o => {
      const { content, name } = o;
      normalized[`${changeCase.camelCase(name.toLowerCase())}`] = {
        content,
        ...o
      };
    });
  } else {
    const { content, name } = obj;
    /* eslint-disable */
    normalized[`${changeCase.camelCase(name.toLowerCase())}`] = {
      content,
      ...o
    };
    /* eslint-enable */
  }

  return normalized;
};
