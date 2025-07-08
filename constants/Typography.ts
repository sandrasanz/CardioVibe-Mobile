// Universal Typography Constants
// Use these throughout the app to ensure consistent text sizing

export const TYPOGRAPHY = {
  // Headers - Better proportional hierarchy
  title: 24,        // Main page titles (h1) - reduced from 28
  heading: 20,      // Section headings (h2) - reduced from 24  
  subheading: 18,   // Subsection headings (h3) - reduced from 20
  subtitle: 16,     // Small headings (h4) - same as body
  caption: 14,      // Very small headings (h5) - moved from 12 to 14
  
  // Body text
  body: 16,         // Standard body text - THIS IS THE UNIVERSAL SIZE
  bodySmall: 14,    // Small body text (secondary info)
  label: 12,        // Labels, very small text
  
  // Interactive elements
  button: 16,       // Button text
  input: 16,        // Input field text
  
  // Special cases
  large: 28,        // Large numbers, stats - reduced from 32
  extraLarge: 36,   // Very large numbers - reduced from 48
  massive: 48,      // Only for very special cases like main BP readings
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const COLORS = {
  primary: '#000000',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  green: '#E3E7CF',
  purple: '#E3E2F6',
  pink: '#EDE3E4',
  blue: '#e0f2fe',
};