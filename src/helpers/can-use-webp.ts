/**
 * Check if browser support webp
 */
const canSupportWebp = (() => {
  let isChecked: boolean | undefined;

  return () => {
    if (isChecked !== undefined) {
      return isChecked;
    }

    if ('object' !== typeof document) {
      return false;
    }

    const canvas = document.createElement('canvas');

    if (!canvas.getContext || !canvas.getContext('2d')) {
      return (isChecked = false);
    }

    return (isChecked = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
  };
})();

export default canSupportWebp;
