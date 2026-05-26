export const buildUpdateExpression = <T extends Record<string, any>>(details: Partial<T>) => {
  // Remove undefined fields
  const fieldsToUpdate = Object.entries(details).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  // Add audit field
  fieldsToUpdate.dateUpdated = new Date().toISOString();

  const updateParts: string[] = [];
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    const nameKey = `#${key}`;
    const valueKey = `:${key}`;

    updateParts.push(`${nameKey} = ${valueKey}`);

    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = value;
  }

  return {
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
