const handleDelete = (selection, sequence, features) => {
  const deleteStart = selection.startIndex || selection - 1;
  const deleteEnd = selection.endIndex || deleteStart + 1;
  const newFeatures = features.filter(feature => feature.startIndex !== deleteStart);
  const newSequence = sequence.substr(0, deleteStart) + sequence.substr(deleteEnd);
  return {sequence: newSequence, features: newFeatures, selection: deleteStart};
};

const handleSelectionAdd = (selection, sequence, features, value) => {
  const baseData = handleDelete(selection, sequence, features);
  return {
    ...baseData,
    sequence: baseData.sequence.substr(0, baseData.selection) + value + baseData.sequence.substr(baseData.selection),
    selection: baseData.selection + value.length
  };
};

const handleCaretAdd = (selection, sequence, features, value) => ({
  sequence: sequence.substr(0, selection) + value + sequence.substr(selection),
  selection: selection + value.length,
  features: features
});

export const handleChangeEvent = ({selection, type, value, sequence, features}) => {
  if (type === 'DELETE') {
    return handleDelete(selection, sequence, features);
  }
  if (type === 'ADDITION') {
    const fn = typeof selection === 'number' ? handleCaretAdd : handleSelectionAdd;
    return fn(selection, sequence, features, value);
  }

  return {sequence, features, selection};
};
