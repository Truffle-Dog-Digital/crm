function getProfileId(input) {
  // Regular expression to match the profile ID in LinkedIn URLs or direct profile ID strings
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

// For my OCD, will render attributes in order of visual importance
function reorderProfileDetails(profileDetails, profileId) {
  const { name, requestSent, customText, roles, profile, ...rest } =
    profileDetails;
  return {
    name,
    profileId,
    roles,
    requestSent,
    customText,
    ...rest,
  };
}

module.exports = { getProfileId, reorderProfileDetails };
