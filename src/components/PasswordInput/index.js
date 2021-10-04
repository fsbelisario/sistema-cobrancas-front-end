import { useState } from 'react';
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

function PasswordInput(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormControl>
      <Input
        className={props.className}
        id={props.id}
        type={passwordVisible ? 'text' : 'password'}
        error={props.error}
        {...props.register()}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PasswordInput;