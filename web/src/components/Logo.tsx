import logo from '../assets/images/logo.svg';

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <img 
      src={logo} 
      alt="Logo Pret&Go" 
      className={className} 
    />
  );
};

export default Logo;
