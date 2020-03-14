import React, { useState } from 'react';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  form: {
    border: '1px solid black',
  }
});

const Form = (props) => {

  async function getEthernetSettings() {
    const data = await fetch('http://localhost:9000/getInternetSettings').then(res => res.text()).then(res => [JSON.parse(res)] );
    setEthernetSettings(data);
    return data;
  }

  const [autoEthernetSettings, setEthernetSettings] = useState(getEthernetSettings());

  const classes = useStyles();

  return (
    <form className={classes.form}>
      <div>
        <p>Ethernet Settings</p>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input id="my-input" />
        </FormControl>
      </div>
    </form>
  );

}

export default Form;
