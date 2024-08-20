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

function reorderProfileDetails(profileDetails) {
  const {
    ver,
    name,
    profileId,
    linkedinDistance,
    pendingConnectionRequest,
    roles,
    notes,
    firstContact,
    requestLastSent,
    lastGrabbed,
    audit,
    linkedinBirthday,
    linkedinWebsite,
    linkedinWebsites,
    linkedinEmail,
    linkedinConnected,
    channel,
    bestChannelConnected,
    oldProfileId,
    customText,
    campaign,
    social,
    ignore,
    ...rest
  } = profileDetails;

  const reorderedProfile = {
    ver,
    name,
    profileId,
    linkedinDistance,
    pendingConnectionRequest,
    roles,
    notes,
    firstContact,
    requestLastSent,
    lastGrabbed,
    audit,
    linkedinBirthday,
    linkedinWebsite,
    linkedinWebsites,
    linkedinEmail,
    linkedinConnected,
    channel,
    bestChannelConnected,
    oldProfileId,
    customText,
    social,
    ignore,
    ...rest,
  };

  // Remove keys with undefined or null values
  Object.keys(reorderedProfile).forEach((key) => {
    if (reorderedProfile[key] === undefined || reorderedProfile[key] === null) {
      delete reorderedProfile[key];
    }
  });

  return reorderedProfile;
}

function mergeHumans(master, update) {
  // Step 1: Define the merge function for each merge strategy
  function mergeOverwrite(masterValue, updateValue) {
    return updateValue;
  }

  function mergeIgnore(masterValue, updateValue) {
    return masterValue;
  }

  function mergeConcatMultiline(masterValue, updateValue) {
    if (typeof masterValue === "string" && typeof updateValue === "string") {
      return masterValue + "\n" + updateValue;
    }
    throw new Error(`mergeConcatMultiline called with one or more non-strings`);
  }

  function mergeConcatArray(masterValue, updateValue) {
    if (Array.isArray(masterValue) && Array.isArray(updateValue)) {
      return masterValue.concat(updateValue);
    }
    throw new Error(`mergeConcatArray called with one or more non-arrays`);
  }

  // Step 2: Create a mapping of keys to merge functions inside the main function
  const mergeStrategy = {
    name: mergeOverwrite,
    profileId: mergeIgnore,
    linkedinDistance: mergeOverwrite,
    pendingConnectionRequest: mergeOverwrite,
    roles: mergeOverwrite,
    notes: mergeConcatMultiline,
    firstContact: mergeIgnore,
    requestLastSent: mergeOverwrite,
    lastGrabbed: mergeOverwrite,
    audit: mergeConcatArray,
    linkedinBirthday: mergeOverwrite,
    linkedinWebsite: mergeOverwrite,
    linkedinWebsites: mergeOverwrite,
    linkedinEmail: mergeOverwrite,
    linkedinConnected: mergeOverwrite,
    channel: mergeOverwrite,
    bestChannelConnected: mergeOverwrite,
    oldProfileId: mergeIgnore,
    customText: mergeOverwrite,
    social: mergeOverwrite,
    ignore: mergeOverwrite,
  };

  // Step 3: Merge the objects
  const merged = { ...master }; // Start with a shallow copy of master

  for (const key in update) {
    const updateValue = update[key];
    const masterValue = master[key];

    // Check if there's a merge strategy defined for the key
    const mergeFunction = mergeStrategy[key];
    if (!mergeFunction) {
      throw new Error(`Error: No merge strategy defined for key: "${key}"`);
    }

    // If the key exists in the master, apply the merge function
    if (masterValue !== undefined && masterValue !== null) {
      merged[key] = mergeFunction(masterValue, updateValue);
    } else {
      // If the key is undefined or null in master, directly use the update value
      merged[key] = updateValue;
    }
  }

  return reorderProfileDetails(merged);
}

module.exports = {
  getProfileId,
  reorderProfileDetails,
  mergeHumans,
};
