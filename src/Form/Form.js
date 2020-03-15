import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CustomizedRadios from './radioButtons';

const useStyles = makeStyles({
  form: {
    width: '80%',
    margin: '0 auto',
    padding: '0 10px',
    border: '1px solid black',
    '& p': {
      margin: 0,
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
  ethernetSettingsWrapper: {
    width: '50%',
    padding: '10px 0',
    borderRight: '1px solid black',
  },
});

const Form = (props) => {

  async function getEthernetSettings() {
    const data = await fetch('http://localhost:9000/getInternetSettings').then(res => res.text()).then(res => [JSON.parse(res)] );
    setEthernetSettings(data);
    return data;
  }

  const [autoEthernetSettings, setEthernetSettings] = useState(getEthernetSettings());

  const handleChange = (e) => {
    console.log(e);
  }

  const classes = useStyles();
  return (
    <form className={classes.form}>
      <div className={classes.ethernetSettingsWrapper}>
        <p>Ethernet Settings</p>
        <CustomizedRadios onClick={handleChange} />
        <TextField id="outlined-basic" variant="outlined" />
      </div>
    </form>
  );

}

export default Form;
