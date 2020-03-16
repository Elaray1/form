import React, { useState, useEffect, useRef } from 'react';
import { TextField, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import EthernetIpRadioButtons from './ethernetIpRadioButtons';
import EthernetDNSRadioButtons from './ethernetDNSRadioButtons';
import refreshImg from './refresh_grey.png';

const useStyles = makeStyles({
  form: {
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
  formContent: {
    display: 'flex',
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
    '& label': {
      color: '#DCDCDC'
    }
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
  },
  formButton: {
    borderRadius: '20%',
    marginRight: '20px'
  },
  formButtonsWrapper: {
    padding: '10px',
    borderTop: '1px solid gray',
  },
});

const Form = (props) => {

  const getEthernetSettings = () =>  {
    const data = fetch('http://localhost:9000/getInternetSettings').then(res => res.text()).then(res => [JSON.parse(res)] );
    return data;
  }

  const [autoEthernetSettings, setEthernetSettings] = useState([]);
  const [ipRadioButtonValue, setIpRadioButtonValue] = useState('auto-ip-settings');
  const [dnsRadioButtonValue, setDNSRadioButtonValue] = useState('auto-dns-settings');
  const [networkName, setNetworkName] = React.useState('');
  const [isIpValid, setIsIpValid] = React.useState(false);
  const [isNetmaskValid, setIsNetmaskValid] = React.useState(false);
  const [isDNSValid, setIsDNSValid] = React.useState(false);
  const [enableWifiCheckbox, setEnableWifiCheckbox] = React.useState(true);
  const [wirelessCheckboxValue, setWirelessCheckboxValue] = React.useState(false);
  const ethernetIpInputs = useRef(null);
  const ethernetDNSInputs = useRef(null);
  const securityKeyLabel = useRef(null);

  useEffect(() => {
    (async () => {
      if (!autoEthernetSettings.length) setEthernetSettings(await getEthernetSettings());
    })();
  }, [autoEthernetSettings]);

  const changeNetworkName = event => {
    setNetworkName(event.target.value);
  }

  const changeIpRadioValue = event => {
    setIpRadioButtonValue(event.target.value);
    ipRadioButtonValue !== 'auto-ip-settings'  ?  ethernetIpInputs.current.childNodes.forEach(el => el.firstChild.setAttribute('style', 'color: #DCDCDC;')) : ethernetIpInputs.current.childNodes.forEach(el => el.firstChild.setAttribute('style', 'color: gray;'))
  }

  const changeDNSRadioValue = event => {
    setDNSRadioButtonValue(event.target.value);
    dnsRadioButtonValue !== 'auto-dns-settings'  ?  ethernetDNSInputs.current.childNodes.forEach(el => el.firstChild.setAttribute('style', 'color: #DCDCDC;')) : ethernetDNSInputs.current.childNodes.forEach(el => el.firstChild.setAttribute('style', 'color: gray;'))
  }

  const changeEnableWifiCheckbox = event => {
    setEnableWifiCheckbox(!enableWifiCheckbox);
    securityKeyLabel.current.setAttribute('style', !enableWifiCheckbox && wirelessCheckboxValue ? 'color: gray;' : 'color: #DCDCDC;');
    let elements = event.target;
    for (let i = 0; i < 4; i++) {
      elements = elements.parentElement;
    }
    elements.childNodes.forEach((el, i) => {
      if (i < 2) return;
      enableWifiCheckbox ? el.setAttribute('style', 'color: #DCDCDC;') : el.setAttribute('style', 'color: gray;');
    });
  }

  const changeWirelessCheckbox = event => {
    setWirelessCheckboxValue(!wirelessCheckboxValue);
    securityKeyLabel.current.setAttribute('style', enableWifiCheckbox && !wirelessCheckboxValue ? 'color: gray;' : 'color: #DCDCDC;');
  }

  const validateIPaddress = event => {
     if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(event.target.value)) {
        setIsIpValid(true);
        return;
      }
      setIsIpValid(false);
  }

  const validateNetmask = event => {
    if (/^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/g.test(event.target.value)) {
       setIsNetmaskValid(true);
       return;
     }
     setIsNetmaskValid(false);
  }

  const validateDNS = event => {
    if (/^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/g.test(event.target.value)) {
       setIsDNSValid(true);
       return;
     }
     setIsDNSValid(false);
  }

  const classes = useStyles();
  return (
    <form className={classes.form}>
      <div className={classes.formContent}>
        <div className={classes.ethernetSettingsWrapper}>
          <p>Ethernet Settings</p>
          <EthernetIpRadioButtons onChange={changeIpRadioValue} value={ipRadioButtonValue} />
          <div ref={ethernetIpInputs} className={classes.inputsGroup}>
            <div>
              <label htmlFor="ip-address"><h3>IP address: <span className={classes.redText}>*</span></h3></label>
              <TextField error={!isIpValid} disabled={ipRadioButtonValue === 'auto-ip-settings' ? true : false} id="ip-address" variant="outlined" onChange={validateIPaddress}  />
            </div>
            <div>
              <label htmlFor="subnet-mask"><h3>Subnet Mask: <span className={classes.redText}>*</span></h3></label>
              <TextField error={!isNetmaskValid} disabled={ipRadioButtonValue === 'auto-ip-settings' ? true : false} id="subnet-mask" variant="outlined" onChange={validateNetmask} />
            </div>
            <div>
              <label htmlFor="default-gateway"><h3>Default Gateway:</h3></label>
              <TextField disabled={ipRadioButtonValue === 'auto-ip-settings' ? true : false} id="default-gateway" variant="outlined" />
            </div>
          </div>
          <EthernetDNSRadioButtons onChange={changeDNSRadioValue} value={dnsRadioButtonValue} />
          <div ref={ethernetDNSInputs} className={classes.inputsGroup}>
            <div>
              <label htmlFor="dns-server"><h3>Preferred DNS server: <span className={classes.redText}>*</span></h3></label>
              <TextField error={!isDNSValid} disabled={dnsRadioButtonValue === 'auto-dns-settings' ? true : false} id="dns-server" variant="outlined" onChange={validateDNS} />
            </div>
            <div>
              <label htmlFor="alt-dns-server"><h3>Alternative DNS server:</h3></label>
              <TextField disabled={dnsRadioButtonValue === 'auto-dns-settings' ? true : false} id="alt-dns-server" variant="outlined" />
            </div>
          </div>
        </div>
        <div className={classes.wirelessSettingsWrapper}>
          <p>Wireless Settings</p>
          <FormControlLabel
              value="enable-wifi"
              control={<Checkbox color="primary" />}
              label="Enable wifi:"
              labelPlacement="end"
              onChange={changeEnableWifiCheckbox}
              checked={enableWifiCheckbox}
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
            </div>
            <FormControlLabel
                value="enable-wireless-security"
                control={<Checkbox color="primary" />}
                label="Enable Wireless Security:"
                labelPlacement="end"
                onChange={enableWifiCheckbox ? changeWirelessCheckbox : null}
                checked={enableWifiCheckbox ? wirelessCheckboxValue : false}
              />
              <div className={classes.inputsGroup}>
                <div>
                  <label htmlFor="security-key" ref={securityKeyLabel}><h3>Security Key: <span className={classes.redText}>*</span></h3></label>
                  <TextField id="security-key" variant="outlined" disabled={enableWifiCheckbox ? !wirelessCheckboxValue : true} />
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
      </div>
      <div className={classes.formButtonsWrapper}>
        <Button className={classes.formButton} variant="contained" color="primary">
          Primary
        </Button>
        <Button className={classes.formButton} variant="outlined" color="primary">
          Primary
        </Button>
      </div>
    </form>
  );

}

export default Form;
