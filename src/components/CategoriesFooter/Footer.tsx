import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Forum, Diversity3, MedicalServices } from '@mui/icons-material';

const Footer = () => {
  const [value, setValue] = useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <BottomNavigation
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction label="Accueil" value="recents" icon={<Home />} />
      <BottomNavigationAction
        label="Patients"
        value="favorites"
        icon={<MedicalServices />}
      />
      <BottomNavigationAction
        label="Groupes"
        value="nearby"
        icon={<Diversity3 />}
      />
      <BottomNavigationAction label="Privées" value="folder" icon={<Forum />} />
    </BottomNavigation>
  );
};

export default Footer;
