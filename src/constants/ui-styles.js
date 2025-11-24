// Color palette for MoneyPro app
export const COLORS = {
  // Primary gradient colors
  primary: {
    gradient: 'from-blue-500 to-indigo-600',
    gradientStart: 'bg-blue-500',
    gradientEnd: 'bg-indigo-600',
    base: 'bg-blue-500',
    hover: 'bg-blue-600',
    text: 'text-blue-500',
    light: 'bg-blue-100'
  },
  secondary: {
    gradient: 'from-green-500 to-emerald-600',
    gradientStart: 'bg-green-500',
    gradientEnd: 'bg-emerald-600',
    base: 'bg-green-500',
    hover: 'bg-green-600',
    text: 'text-green-500',
    light: 'bg-green-100'
  },
  danger: {
    gradient: 'from-red-500 to-pink-600',
    gradientStart: 'bg-red-500',
    gradientEnd: 'bg-pink-600',
    base: 'bg-red-500',
    hover: 'bg-red-600',
    text: 'text-red-500',
    light: 'bg-red-100'
  },
  warning: {
    gradient: 'from-yellow-500 to-orange-600',
    gradientStart: 'bg-yellow-500',
    gradientEnd: 'bg-orange-600',
    base: 'bg-yellow-500',
    hover: 'bg-yellow-600',
    text: 'text-yellow-500',
    light: 'bg-yellow-100'
  },
  success: {
    gradient: 'from-green-400 to-emerald-500',
    gradientStart: 'bg-green-400',
    gradientEnd: 'bg-emerald-500',
    base: 'bg-green-500',
    hover: 'bg-green-600',
    text: 'text-green-500',
    light: 'bg-green-100'
  },
  info: {
    gradient: 'from-purple-500 to-pink-600',
    gradientStart: 'bg-purple-500',
    gradientEnd: 'bg-pink-600',
    base: 'bg-purple-500',
    hover: 'bg-purple-600',
    text: 'text-purple-500',
    light: 'bg-purple-100'
  }
};

// Common UI styles
export const UI_STYLES = {
  card: {
    base: 'rounded-xl shadow-lg border border-gray-100 p-6',
    hover: 'hover:shadow-xl transition-all duration-300',
    background: 'bg-white'
  },
  button: {
    base: 'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
    primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    icon: 'p-2 rounded-lg hover:bg-gray-100 transition-colors'
  },
  input: {
    base: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
    error: 'border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:ring-green-500'
  },
  badge: {
    base: 'px-3 py-1 rounded-full text-xs font-medium',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-blue-100 text-blue-800'
  },
  progress: {
    base: 'w-full bg-gray-200 rounded-full h-2',
    bar: 'h-2 rounded-full transition-all duration-300'
  }
};

// Typography styles
export const TYPOGRAPHY = {
  headings: {
    h1: 'text-3xl font-bold text-gray-900',
    h2: 'text-2xl font-bold text-gray-900',
    h3: 'text-xl font-bold text-gray-900',
    h4: 'text-lg font-bold text-gray-900'
  },
  body: {
    large: 'text-lg text-gray-700',
    base: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    xsmall: 'text-xs text-gray-500'
  }
};

// Spacing system
export const SPACING = {
  xsmall: 'space-y-1',
  small: 'space-y-2',
  medium: 'space-y-4',
  large: 'space-y-6',
  xlarge: 'space-y-8'
};

// Common component layouts
export const LAYOUTS = {
  container: 'max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8',
  grid: {
    two: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    three: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    four: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
  }
};