// Return a profileId regardless of whether the input is
// a linkedin URL with an embedded profileId or a direct profileId
function getProfileId(input) {
  const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/([^/]+)\/?$/;
  const directRegex = /^[a-zA-Z0-9-]+$/;

  if (directRegex.test(input)) {
    return input;
  }

  const match = input.match(regex);

  if (match) {
    return match[3];
  } else {
    console.log(`Error: Unable to extract profile ID from input: ${input}`);
    return null;
  }
}

// Reformat a human's keys to be more readable in jsonl file format
function reorderProfileDetails(profileDetails) {
  const {
    name,
    profileId,
    linkedinDistance,
    roles,
    requestSent,
    customText,
    notes,
    channel,
    bestChannelConnected,
    lastGrabbed,
    audit,
    oldProfileId,
    pendingConnectionRequest,
    ...rest
  } = profileDetails;

  const reorderedProfile = {
    name,
    profileId,
    linkedinDistance,
    roles,
    requestSent,
    customText,
    notes,
    channel,
    bestChannelConnected,
    lastGrabbed,
    audit,
    oldProfileId,
    pendingConnectionRequest,
    ...rest,
  };

  // Remove keys with undefined values
  Object.keys(reorderedProfile).forEach((key) => {
    if (reorderedProfile[key] === undefined) {
      delete reorderedProfile[key];
    }
  });

  return reorderedProfile;
}

module.exports = {
  getProfileId,
  reorderProfileDetails,
};
