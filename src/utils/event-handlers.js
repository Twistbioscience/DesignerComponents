const handleDelete = (selection, sequence, features) => {
  const deleteStart = selection.startIndex || selection - 1;
  const deleteEnd = selection.endIndex || deleteStart + 1;
  const newFeatures = features.filter(feature => feature.startIndex !== deleteStart);
  const newSequence = sequence.substr(0, deleteStart) + sequence.substr(deleteEnd);
  return {sequence: newSequence, features: newFeatures, selection: deleteStart};
};

export const handleChangeEvent = ({selection, type, value, sequence, features}) => {
  if (type === 'DELETE') {
    return handleDelete(selection, sequence, features);
  }
  if (type === 'ADDITION') {
    return {sequence, features, selection};
  }
  return {sequence, features, selection};
};
