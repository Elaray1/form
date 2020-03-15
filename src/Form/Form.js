import React, { useState, useEffect } from 'react';
import { TextField, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import EthernetIpRadioButtons from './ethernetIpRadioButtons';
import EthernetDNSRadioButtons from './ethernetDNSRadioButtons';
import refreshImg from './refresh_grey.png';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    width: '90%',
    margin: '0 auto',
    border: '1px solid gray',
    color: 'gray',
    '& p': {
      margin: 0,
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'black',
    },
  },
  ethernetSettingsWrapper: {
    width: '50%',
    padding: '15px',
    borderRight: '1px solid black',
  },
  inputsGroup: {
    '& > div': {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '10px 0',
    },
    '& > div > div': {
      width: '57%',
      marginLeft: '15px',
    },
  },
  redText: {
    color: 'red'
  },
  wirelessSettingsWrapper: {
    width: '50%',
    padding: '15px',
  },
  formControl: {
    width: '60%'
  },
  refreshBtn: {
    width: '40px !important',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid gray',
    cursor: 'pointer',
    margin: 'auto 10px',
  }
});

const Form = (props) => {

  async function getEthernetSettings() {
    const data = await fetch('http://localhost:9000/getInternetSettings').then(res => res.text()).then(res => [JSON.parse(res)] );
    return data;
  }

  const [autoEthernetSettings, setEthernetSettings] = useState([]);
  const [ipRadioButtonValue, setIpRadioButtonValue] = useState('auto-ip-settings');
  const [networkName, setNetworkName] = React.useState('');

  useEffect(() => {
    if (autoEthernetSettings.length) setEthernetSettings(getEthernetSettings());
  }, [autoEthernetSettings]);

  const changeNetworkName = event => {
    setNetworkName(event.target.value);
  }

  const classes = useStyles();
  return (
    <form className={classes.form}>
      <div className={classes.ethernetSettingsWrapper}>
        <p>Ethernet Settings</p>
        <EthernetIpRadioButtons onChange={setIpRadioButtonValue} value={ipRadioButtonValue} />
        <div className={classes.inputsGroup}>
          <div>
            <label htmlFor="ip-address"><h3>IP address: <span className={classes.redText}>*</span></h3></label>
            <TextField id="ip-address" variant="outlined" />
          </div>
          <div>
            <label htmlFor="subnet-mask"><h3>Subnet Mask: <span className={classes.redText}>*</span></h3></label>
            <TextField id="subnet-mask" variant="outlined" />
          </div>
          <div>
            <label htmlFor="default-gateway"><h3>Default Gateway:</h3></label>
            <TextField id="default-gateway" variant="outlined" />
          </div>
        </div>
        <EthernetDNSRadioButtons />
        <div className={classes.inputsGroup}>
          <div>
            <label htmlFor="dns-server"><h3>Preferred DNS server: <span className={classes.redText}>*</span></h3></label>
            <TextField id="dns-server" variant="outlined" />
          </div>
          <div>
            <label htmlFor="alt-dns-server"><h3>Alternative DNS server:</h3></label>
            <TextField id="alt-dns-server" variant="outlined" />
          </div>
        </div>
      </div>
      <div className={classes.wirelessSettingsWrapper}>
        <p>Wireless Settings</p>
        <FormControlLabel
            value="enable-wife"
            control={<Checkbox color="primary" />}
            label="Enable wifi:"
            labelPlacement="end"
          />
          <div className={classes.inputsGroup}>
            <div>
              <h3>Wireless Network Name: <span className={classes.redText}>*</span></h3>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Please select
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={networkName}
                  onChange={changeNetworkName}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <div className={classes.refreshBtn} >
                <img width="40" src={refreshImg} alt="refesh" />
              </div>
            </div>
            <FormControlLabel
                value="enable-wife"
                control={<Checkbox color="primary" />}
                label="Enable Wireless Security:"
                labelPlacement="end"
              />
              <div>
                <label htmlFor="security-key"><h3>Security Key: <span className={classes.redText}>*</span></h3></label>
                <TextField id="security-key" variant="outlined" />
              </div>
          </div>
          <EthernetIpRadioButtons onChange={setIpRadioButtonValue} value={ipRadioButtonValue} />
          <div className={classes.inputsGroup}>
            <div>
              <label htmlFor="ip-address"><h3>IP address: <span className={classes.redText}>*</span></h3></label>
              <TextField id="ip-address" variant="outlined" />
            </div>
            <div>
              <label htmlFor="subnet-mask"><h3>Subnet Mask: <span className={classes.redText}>*</span></h3></label>
              <TextField id="subnet-mask" variant="outlined" />
            </div>
            <div>
              <label htmlFor="default-gateway"><h3>Default Gateway:</h3></label>
              <TextField id="default-gateway" variant="outlined" />
            </div>
          </div>
          <EthernetDNSRadioButtons />
          <div className={classes.inputsGroup}>
            <div>
              <label htmlFor="dns-server"><h3>Preferred DNS server: <span className={classes.redText}>*</span></h3></label>
              <TextField id="dns-server" variant="outlined" />
            </div>
            <div>
              <label htmlFor="alt-dns-server"><h3>Alternative DNS server:</h3></label>
              <TextField id="alt-dns-server" variant="outlined" />
            </div>
          </div>
      </div>
    </form>
  );

}

export default Form;
