import brandLogo from '../../assets/bhg-logo.png';

const SIZE_STYLES = {
  sidebar: {
    width: '90%',
    height: 'auto',
    objectFit: 'contain',
    objectPosition: 'left',
    display: 'block',
  },
  login: {
    width: '85%',
    maxWidth: 300,
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  compact: {
    height: 40,
    width: 'auto',
    maxWidth: 200,
    objectFit: 'contain',
    display: 'block',
  },
};

export function BhgLogo({ size = 'sidebar', alt = 'BHG', style = {}, className = '' }) {
  return (
    <img
      src={brandLogo}
      alt={alt}
      className={`bhg-logo ${className}`.trim()}
      style={{ ...SIZE_STYLES[size], ...style }}
    />
  );
}
