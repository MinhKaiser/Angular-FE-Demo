/**
 * Common utility functions
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateDiscount = (original: number, discountPercent: number): number => {
  return original - (original * discountPercent) / 100;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number
): ((...args: TArgs) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getImageUrl = (width: number, height: number, text?: string): string => {
  const baseUrl = 'https://dummyjson.com/image';
  if (text) {
    return `${baseUrl}/${width}x${height}?text=${encodeURIComponent(text)}`;
  }
  return `${baseUrl}/${width}x${height}`;
};
