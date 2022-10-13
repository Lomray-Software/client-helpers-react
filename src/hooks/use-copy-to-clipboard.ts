import { useState } from 'react';

type ICopiedValue = string | null;
type ICopyFn = (text?: string) => Promise<boolean>; // Return success

/**
 * This hook copy text to clipboard
 */
const useCopyToClipboard = (): [ICopiedValue, ICopyFn] => {
  const [copiedText, setCopiedText] = useState<ICopiedValue>(null);

  const copy: ICopyFn = async (text) => {
    if (!navigator?.clipboard) {
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      if (!text) {
        return false;
      }

      await navigator.clipboard.writeText(text);
      setCopiedText(text);

      return true;
    } catch (error) {
      setCopiedText(null);

      return false;
    }
  };

  return [copiedText, copy];
};

export default useCopyToClipboard;
