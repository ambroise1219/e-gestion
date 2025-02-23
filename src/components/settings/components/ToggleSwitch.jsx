'use client';

export default function ToggleSwitch({ enabled, onChange, size = 'default' }) {
  const sizes = {
    small: {
      switch: 'h-5 w-9',
      dot: 'h-4 w-4'
    },
    default: {
      switch: 'h-6 w-11',
      dot: 'h-5 w-5'
    },
    large: {
      switch: 'h-7 w-14',
      dot: 'h-6 w-6'
    }
  };

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${sizes[size].switch} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-pro-lime' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block ${
          sizes[size].dot
        } transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
} 