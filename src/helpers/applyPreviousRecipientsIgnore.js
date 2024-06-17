const applyPreviousRecipientsIgnore = (prevRecipients, fetchedRecipients) => {
  const ignoredRecipientIds =
    prevRecipients?.length > 0
      ? prevRecipients.filter((r) => r.ignore).map((r) => r.id)
      : [];

  return fetchedRecipients?.map((r) => ({
    ...r,
    ignore: ignoredRecipientIds?.length
      ? ignoredRecipientIds.includes(r.id)
      : false,
  }));
};

export default applyPreviousRecipientsIgnore;
