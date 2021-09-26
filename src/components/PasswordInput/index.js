import { FormControl, IconButton, Input, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';


export function PasswordInput(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormControl>
      <Input
        className={props.className}
        id={props.id} 
        type={passwordVisible ? "text" : "password"}
        error={props.error}
        {...props.register()}
        endAdornment={
          <InputAdornment position="end">
            <IconButton 
              aria-label="toggle password visibility"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        } 
      />
    </FormControl>
  );
}